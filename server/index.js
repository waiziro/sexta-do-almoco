import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import path from 'path';
import dotenv from 'dotenv';
import * as db from './db.js';
import { searchNearby } from './places.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' ? false : ['http://localhost:5173']
  }
});

app.use(express.json());

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'dist')));
}

function emitSessionUpdate(code, sessionId) {
  const participants = db.getParticipants(sessionId);
  const suggestions = db.getSuggestions(sessionId);
  const votes = db.getVotes(sessionId);
  io.to(code).emit('session-update', { participants, suggestions, votes });
}

// --- Sessions ---

app.post('/api/sessions', (req, res) => {
  try {
    const session = db.createSession();
    res.json(session);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create session' });
  }
});

app.get('/api/sessions/:code', (req, res) => {
  const session = db.getSession(req.params.code.toUpperCase());
  if (!session) return res.status(404).json({ error: 'Session not found' });
  const participants = db.getParticipants(session.id);
  const suggestions = db.getSuggestions(session.id);
  const votes = db.getVotes(session.id);
  res.json({ ...session, participants, suggestions, votes });
});

// --- Participants ---

app.post('/api/sessions/:code/join', (req, res) => {
  const session = db.getSession(req.params.code.toUpperCase());
  if (!session) return res.status(404).json({ error: 'Session not found' });

  const { nickname } = req.body;
  if (!nickname || !nickname.trim()) return res.status(400).json({ error: 'Nickname is required' });

  const participants = db.getParticipants(session.id);
  if (participants.length >= 8) return res.status(400).json({ error: 'Session is full (max 8 people)' });
  if (participants.some(p => p.nickname.toLowerCase() === nickname.trim().toLowerCase())) {
    return res.status(400).json({ error: 'Nickname already taken' });
  }

  try {
    const participant = db.addParticipant(session.id, nickname.trim());
    emitSessionUpdate(session.code, session.id);
    res.json(participant);
  } catch (err) {
    res.status(500).json({ error: 'Failed to join session' });
  }
});

app.patch('/api/participants/:id/rsvp', (req, res) => {
  const participant = db.getParticipantById(req.params.id);
  if (!participant) return res.status(404).json({ error: 'Participant not found' });

  const { is_going } = req.body;
  db.updateRSVP(req.params.id, is_going);

  const session = db.getSessionById(participant.session_id);
  emitSessionUpdate(session.code, session.id);
  res.json({ success: true });
});

// --- Suggestions ---

app.get('/api/sessions/:code/suggestions', (req, res) => {
  const session = db.getSession(req.params.code.toUpperCase());
  if (!session) return res.status(404).json({ error: 'Session not found' });
  res.json(db.getSuggestions(session.id));
});

app.post('/api/sessions/:code/suggestions', (req, res) => {
  const session = db.getSession(req.params.code.toUpperCase());
  if (!session) return res.status(404).json({ error: 'Session not found' });
  if (session.status === 'closed') return res.status(400).json({ error: 'Session is closed' });

  const existing = db.getSuggestions(session.id);
  if (req.body.place_id && existing.some(s => s.place_id === req.body.place_id)) {
    return res.status(400).json({ error: 'Already nominated' });
  }

  try {
    const suggestion = db.addSuggestion(session.id, req.body);
    emitSessionUpdate(session.code, session.id);
    res.json(suggestion);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add suggestion' });
  }
});

// --- Votes ---

app.post('/api/suggestions/:id/vote', (req, res) => {
  const { participant_id } = req.body;
  if (!participant_id) return res.status(400).json({ error: 'participant_id is required' });

  const suggestion = db.getSuggestionById(req.params.id);
  if (!suggestion) return res.status(404).json({ error: 'Suggestion not found' });

  const session = db.getSessionById(suggestion.session_id);
  if (session.status === 'closed') return res.status(400).json({ error: 'Session is closed' });

  try {
    db.addVote(req.params.id, participant_id);
    emitSessionUpdate(session.code, session.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to vote' });
  }
});

app.delete('/api/suggestions/:id/vote', (req, res) => {
  const { participant_id } = req.body;
  if (!participant_id) return res.status(400).json({ error: 'participant_id is required' });

  const suggestion = db.getSuggestionById(req.params.id);
  if (!suggestion) return res.status(404).json({ error: 'Suggestion not found' });

  db.removeVote(req.params.id, participant_id);
  const session = db.getSessionById(suggestion.session_id);
  emitSessionUpdate(session.code, session.id);
  res.json({ success: true });
});

// --- Close / Reopen ---

app.post('/api/sessions/:code/close', (req, res) => {
  const session = db.getSession(req.params.code.toUpperCase());
  if (!session) return res.status(404).json({ error: 'Session not found' });

  db.closeSession(session.code);
  const voteCounts = db.getVoteCounts(session.id);
  const suggestions = db.getSuggestions(session.id);

  let winner = null;
  if (voteCounts.length > 0) {
    const maxVotes = voteCounts[0].vote_count;
    const tied = voteCounts.filter(v => v.vote_count === maxVotes);
    const winnerId = tied[Math.floor(Math.random() * tied.length)].suggestion_id;
    winner = suggestions.find(s => s.id === winnerId);
    winner.vote_count = maxVotes;
  }

  io.to(session.code).emit('session-closed', { winner });
  emitSessionUpdate(session.code, session.id);
  res.json({ winner });
});

app.post('/api/sessions/:code/reopen', (req, res) => {
  const session = db.getSession(req.params.code.toUpperCase());
  if (!session) return res.status(404).json({ error: 'Session not found' });

  db.reopenSession(session.code);
  emitSessionUpdate(session.code, session.id);
  res.json({ success: true });
});

// --- Restaurants (master list) ---

app.get('/api/restaurants', (req, res) => {
  res.json(db.getRestaurants());
});

app.post('/api/restaurants', (req, res) => {
  const { name } = req.body;
  if (!name || !name.trim()) return res.status(400).json({ error: 'Name is required' });
  try {
    const restaurant = db.addRestaurant(req.body);
    res.json(restaurant);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add restaurant' });
  }
});

app.put('/api/restaurants/:id', (req, res) => {
  const existing = db.getRestaurantById(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Restaurant not found' });
  try {
    db.updateRestaurant(req.params.id, req.body);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update restaurant' });
  }
});

app.delete('/api/restaurants/:id', (req, res) => {
  db.deleteRestaurant(req.params.id);
  res.json({ success: true });
});

// --- Places (Google API fallback) ---

app.get('/api/places/nearby', async (req, res) => {
  try {
    const restaurants = await searchNearby(process.env.GOOGLE_PLACES_API_KEY);
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ error: 'Failed to search restaurants' });
  }
});

// --- Socket.io ---

io.on('connection', (socket) => {
  socket.on('join-session', (code) => {
    socket.join(code);
  });
});

// --- SPA fallback ---

if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
  });
}

// --- Seed restaurants on first run ---

import { SEED_RESTAURANTS } from './places.js';

if (db.getRestaurantCount() === 0) {
  db.seedRestaurants(SEED_RESTAURANTS);
  console.log(`Seeded ${SEED_RESTAURANTS.length} restaurants`);
}

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
