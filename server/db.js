import Database from 'better-sqlite3';
import { randomUUID } from 'crypto';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database(path.join(__dirname, '..', 'lunch.db'));

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    status TEXT DEFAULT 'open'
  );

  CREATE TABLE IF NOT EXISTS participants (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL,
    nickname TEXT NOT NULL,
    is_going INTEGER DEFAULT NULL,
    joined_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (session_id) REFERENCES sessions(id)
  );

  CREATE TABLE IF NOT EXISTS suggestions (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL,
    place_id TEXT,
    name TEXT NOT NULL,
    rating REAL,
    review_count INTEGER,
    price_level INTEGER,
    avg_price TEXT,
    photo_url TEXT,
    address TEXT,
    cuisine TEXT,
    walk_time INTEGER,
    suggested_by TEXT,
    FOREIGN KEY (session_id) REFERENCES sessions(id),
    FOREIGN KEY (suggested_by) REFERENCES participants(id)
  );

  CREATE TABLE IF NOT EXISTS votes (
    id TEXT PRIMARY KEY,
    suggestion_id TEXT NOT NULL,
    participant_id TEXT NOT NULL,
    UNIQUE(suggestion_id, participant_id),
    FOREIGN KEY (suggestion_id) REFERENCES suggestions(id),
    FOREIGN KEY (participant_id) REFERENCES participants(id)
  );

  CREATE TABLE IF NOT EXISTS restaurants (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    rating REAL DEFAULT 4.5,
    review_count INTEGER DEFAULT 100,
    price_level INTEGER DEFAULT 2,
    avg_price TEXT,
    photo_url TEXT,
    address TEXT,
    cuisine TEXT,
    walk_time INTEGER DEFAULT 10
  );
`);

function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

function formatParticipant(p) {
  if (!p) return null;
  return { ...p, is_going: p.is_going === null ? null : p.is_going === 1 };
}

export function createSession() {
  const id = randomUUID();
  let code = generateCode();
  while (db.prepare('SELECT id FROM sessions WHERE code = ?').get(code)) {
    code = generateCode();
  }
  db.prepare('INSERT INTO sessions (id, code) VALUES (?, ?)').run(id, code);
  return { id, code };
}

export function getSession(code) {
  return db.prepare('SELECT * FROM sessions WHERE code = ?').get(code);
}

export function getSessionById(id) {
  return db.prepare('SELECT * FROM sessions WHERE id = ?').get(id);
}

export function closeSession(code) {
  db.prepare("UPDATE sessions SET status = 'closed' WHERE code = ?").run(code);
}

export function reopenSession(code) {
  db.prepare("UPDATE sessions SET status = 'open' WHERE code = ?").run(code);
}

export function addParticipant(sessionId, nickname) {
  const id = randomUUID();
  db.prepare('INSERT INTO participants (id, session_id, nickname) VALUES (?, ?, ?)').run(id, sessionId, nickname);
  return formatParticipant({ id, session_id: sessionId, nickname, is_going: null });
}

export function getParticipantById(id) {
  return formatParticipant(db.prepare('SELECT * FROM participants WHERE id = ?').get(id));
}

export function updateRSVP(participantId, isGoing) {
  db.prepare('UPDATE participants SET is_going = ? WHERE id = ?').run(isGoing ? 1 : 0, participantId);
}

export function getParticipants(sessionId) {
  return db.prepare('SELECT * FROM participants WHERE session_id = ?').all(sessionId).map(formatParticipant);
}

export function addSuggestion(sessionId, data) {
  const id = randomUUID();
  db.prepare(`
    INSERT INTO suggestions (id, session_id, place_id, name, rating, review_count, price_level, avg_price, photo_url, address, cuisine, walk_time, suggested_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id, sessionId,
    data.place_id || null,
    data.name,
    data.rating || null,
    data.review_count || null,
    data.price_level || null,
    data.avg_price || null,
    data.photo_url || null,
    data.address || null,
    data.cuisine || null,
    data.walk_time || null,
    data.suggested_by || null
  );
  return { id, session_id: sessionId, ...data };
}

export function getSuggestions(sessionId) {
  return db.prepare('SELECT * FROM suggestions WHERE session_id = ?').all(sessionId);
}

export function getSuggestionById(id) {
  return db.prepare('SELECT * FROM suggestions WHERE id = ?').get(id);
}

export function addVote(suggestionId, participantId) {
  const suggestion = db.prepare('SELECT session_id FROM suggestions WHERE id = ?').get(suggestionId);
  if (!suggestion) throw new Error('Suggestion not found');

  const removeAndInsert = db.transaction(() => {
    db.prepare(`
      DELETE FROM votes WHERE participant_id = ? AND suggestion_id IN (
        SELECT id FROM suggestions WHERE session_id = ?
      )
    `).run(participantId, suggestion.session_id);
    const id = randomUUID();
    db.prepare('INSERT INTO votes (id, suggestion_id, participant_id) VALUES (?, ?, ?)').run(id, suggestionId, participantId);
  });

  removeAndInsert();
}

export function removeVote(suggestionId, participantId) {
  db.prepare('DELETE FROM votes WHERE suggestion_id = ? AND participant_id = ?').run(suggestionId, participantId);
}

export function getVotes(sessionId) {
  return db.prepare(`
    SELECT v.* FROM votes v
    JOIN suggestions s ON v.suggestion_id = s.id
    WHERE s.session_id = ?
  `).all(sessionId);
}

export function getVoteCounts(sessionId) {
  return db.prepare(`
    SELECT s.id as suggestion_id, COUNT(v.id) as vote_count
    FROM suggestions s
    LEFT JOIN votes v ON v.suggestion_id = s.id
    WHERE s.session_id = ?
    GROUP BY s.id
    ORDER BY vote_count DESC
  `).all(sessionId);
}

// --- Restaurants (master list) ---

export function getRestaurants() {
  return db.prepare('SELECT * FROM restaurants ORDER BY name').all();
}

export function getRestaurantById(id) {
  return db.prepare('SELECT * FROM restaurants WHERE id = ?').get(id);
}

export function addRestaurant(data) {
  const id = randomUUID();
  db.prepare(`
    INSERT INTO restaurants (id, name, rating, review_count, price_level, avg_price, photo_url, address, cuisine, walk_time)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, data.name, data.rating || 4.5, data.review_count || 100, data.price_level || 2, data.avg_price || '', data.photo_url || '', data.address || '', data.cuisine || '', data.walk_time || 10);
  return { id, ...data };
}

export function updateRestaurant(id, data) {
  db.prepare(`
    UPDATE restaurants SET name=?, rating=?, review_count=?, price_level=?, avg_price=?, photo_url=?, address=?, cuisine=?, walk_time=?
    WHERE id=?
  `).run(data.name, data.rating, data.review_count, data.price_level, data.avg_price, data.photo_url, data.address, data.cuisine, data.walk_time, id);
}

export function deleteRestaurant(id) {
  db.prepare('DELETE FROM restaurants WHERE id = ?').run(id);
}

export function getRestaurantCount() {
  return db.prepare('SELECT COUNT(*) as count FROM restaurants').get().count;
}

export function seedRestaurants(restaurants) {
  const insert = db.prepare(`
    INSERT INTO restaurants (id, name, rating, review_count, price_level, avg_price, photo_url, address, cuisine, walk_time)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const insertMany = db.transaction((items) => {
    for (const r of items) {
      insert.run(randomUUID(), r.name, r.rating, r.review_count, r.price_level, r.avg_price, r.photo_url, r.address, r.cuisine, r.walk_time);
    }
  });
  insertMany(restaurants);
}

export default db;
