import { useState } from 'react';
import { api } from '../api';

export default function HomePage({ onSessionCreated, onManage }) {
  const [joinCode, setJoinCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function createSession() {
    setLoading(true);
    setError(null);
    try {
      const session = await api.post('/api/sessions');
      onSessionCreated(session.code);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleJoin() {
    const code = joinCode.trim().toUpperCase();
    if (code.length >= 4) {
      onSessionCreated(code);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleJoin();
  }

  return (
    <div className="home-page">
      <div className="home-logo">🍽️</div>
      <h1>Sexta do Almoco</h1>
      <p className="subtitle">Pick where to eat — together, anonymously!</p>

      <button className="btn-primary" onClick={createSession} disabled={loading}>
        {loading ? 'Creating...' : 'Create Friday Session'}
      </button>

      <div className="divider">or join an existing one</div>

      <div className="join-input-row">
        <input
          type="text"
          value={joinCode}
          onChange={e => setJoinCode(e.target.value.toUpperCase().slice(0, 6))}
          onKeyDown={handleKeyDown}
          placeholder="CODE"
          maxLength={6}
        />
        <button onClick={handleJoin} disabled={joinCode.trim().length < 4}>
          Join
        </button>
      </div>

      {error && <div className="error-msg" style={{ marginTop: 16 }}>{error}</div>}

      <button className="manage-link" onClick={onManage}>
        Manage Restaurants
      </button>
    </div>
  );
}
