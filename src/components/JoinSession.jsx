import { useState, useEffect } from 'react';
import { api } from '../api';

const NICKNAMES = [
  { name: 'Hungry Panda', emoji: '🐼' },
  { name: 'Pizza Master', emoji: '🍕' },
  { name: 'Sushi Lover', emoji: '🍣' },
  { name: 'Taco Star', emoji: '🌮' },
  { name: 'Burger Boss', emoji: '🍔' },
  { name: 'Pasta King', emoji: '🍝' },
  { name: 'Salad Queen', emoji: '🥗' },
  { name: 'Ramen Hero', emoji: '🍜' },
  { name: 'Coffee Guru', emoji: '☕' },
  { name: 'Acai Fan', emoji: '🫐' },
];

export default function JoinSession({ code, onJoined, onBack }) {
  const [selected, setSelected] = useState(null);
  const [custom, setCustom] = useState('');
  const [takenNames, setTakenNames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sessionExists, setSessionExists] = useState(true);

  useEffect(() => {
    api.get(`/api/sessions/${code}`)
      .then(data => {
        setTakenNames(data.participants.map(p => p.nickname.toLowerCase()));
      })
      .catch(() => setSessionExists(false));
  }, [code]);

  const nickname = selected || custom.trim();

  async function handleJoin() {
    if (!nickname) return;
    setLoading(true);
    setError(null);
    try {
      const participant = await api.post(`/api/sessions/${code}/join`, { nickname });
      onJoined(participant);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (!sessionExists) {
    return (
      <div className="join-page">
        <div style={{ fontSize: 48, marginBottom: 16 }}>😕</div>
        <h2>Session not found</h2>
        <p style={{ color: 'var(--text-light)', marginTop: 8 }}>Code "{code}" doesn't match any active session.</p>
        <button className="back-link" onClick={onBack}>Go back</button>
      </div>
    );
  }

  return (
    <div className="join-page">
      <h2>Join the lunch!</h2>
      <div className="code-display">Session {code}</div>
      <h3>Pick your anonymous nickname</h3>

      <div className="nickname-grid">
        {NICKNAMES.map(n => {
          const full = `${n.emoji} ${n.name}`;
          const taken = takenNames.includes(full.toLowerCase());
          return (
            <button
              key={n.name}
              className={`nickname-btn ${selected === full ? 'selected' : ''} ${taken ? 'taken' : ''}`}
              onClick={() => { if (!taken) { setSelected(full); setCustom(''); setError(null); } }}
              disabled={taken}
            >
              <span className="emoji">{n.emoji}</span>
              <span>{n.name}{taken ? ' (taken)' : ''}</span>
            </button>
          );
        })}
      </div>

      <div className="custom-nickname">
        <input
          value={custom}
          onChange={e => { setCustom(e.target.value); setSelected(null); setError(null); }}
          placeholder="Or type your own nickname..."
          maxLength={24}
          onKeyDown={e => { if (e.key === 'Enter') handleJoin(); }}
        />
      </div>

      {error && <div className="error-msg">{error}</div>}

      <button className="btn-primary" onClick={handleJoin} disabled={!nickname || loading}>
        {loading ? 'Joining...' : 'Join Session'}
      </button>

      <button className="back-link" onClick={onBack}>Back to home</button>
    </div>
  );
}
