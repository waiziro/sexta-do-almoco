import { useState, useEffect, useCallback } from 'react';
import { api } from '../api';
import { getSocket } from '../socket';
import ParticipantList from './ParticipantList';
import RestaurantBrowser from './RestaurantBrowser';
import VotingBoard from './VotingBoard';
import Results from './Results';

export default function SessionPage({ code, participant, onLeave }) {
  const [session, setSession] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [votes, setVotes] = useState([]);
  const [activeTab, setActiveTab] = useState('browse');
  const [isGoing, setIsGoing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [winner, setWinner] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }, []);

  useEffect(() => {
    api.get(`/api/sessions/${code}`)
      .then(data => {
        setSession(data);
        setParticipants(data.participants);
        setSuggestions(data.suggestions);
        setVotes(data.votes);
        const me = data.participants.find(p => p.id === participant.id);
        if (me) setIsGoing(me.is_going);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [code, participant.id]);

  useEffect(() => {
    const socket = getSocket();
    socket.emit('join-session', code);

    socket.on('session-update', (data) => {
      setParticipants(data.participants);
      setSuggestions(data.suggestions);
      setVotes(data.votes);
      const me = data.participants.find(p => p.id === participant.id);
      if (me && isGoing === null && me.is_going !== null) {
        setIsGoing(me.is_going);
      }
    });

    socket.on('session-closed', (data) => {
      setSession(s => ({ ...s, status: 'closed' }));
      if (data.winner) {
        setWinner(data.winner);
        setShowResults(true);
      }
    });

    return () => {
      socket.off('session-update');
      socket.off('session-closed');
    };
  }, [code, participant.id, isGoing]);

  async function handleRSVP(going) {
    setIsGoing(going);
    await api.patch(`/api/participants/${participant.id}/rsvp`, { is_going: going });
  }

  async function handleNominate(restaurant) {
    try {
      await api.post(`/api/sessions/${code}/suggestions`, {
        ...restaurant,
        place_id: restaurant.place_id || restaurant.id,
        suggested_by: participant.id
      });
      showToast(`${restaurant.name} nominated!`);
      setActiveTab('vote');
    } catch (err) {
      showToast(err.message);
    }
  }

  async function handleVote(suggestionId) {
    try {
      await api.post(`/api/suggestions/${suggestionId}/vote`, {
        participant_id: participant.id
      });
    } catch (err) {
      showToast(err.message);
    }
  }

  async function handleClose() {
    try {
      const result = await api.post(`/api/sessions/${code}/close`);
      if (result.winner) {
        setWinner(result.winner);
        setShowResults(true);
      }
    } catch (err) {
      showToast(err.message);
    }
  }

  async function handleReopen() {
    try {
      await api.post(`/api/sessions/${code}/reopen`);
      setSession(s => ({ ...s, status: 'open' }));
      setWinner(null);
      setShowResults(false);
    } catch (err) {
      showToast(err.message);
    }
  }

  function copyLink() {
    const url = `${window.location.origin}?s=${code}`;
    navigator.clipboard.writeText(url).then(
      () => showToast('Link copied!'),
      () => showToast('Could not copy')
    );
  }

  const myVote = votes.find(v => v.participant_id === participant.id);
  const nominatedIds = suggestions.map(s => s.place_id).filter(Boolean);
  const isClosed = session?.status === 'closed';
  const goingCount = participants.filter(p => p.is_going === true).length;

  if (loading) {
    return (
      <div className="page page-wide">
        <div className="loading"><div className="spinner" /></div>
      </div>
    );
  }

  return (
    <div className="page page-wide">
      <div className="session-header">
        <h2>🍽️ Sexta do Almoco</h2>
        <div className="session-header-right">
          <div className="session-code-badge">
            <span>{code}</span>
            <button className="copy-btn" onClick={copyLink}>Copy link</button>
          </div>
          <button className="leave-btn" onClick={onLeave}>Leave</button>
        </div>
      </div>

      <ParticipantList participants={participants} />

      {isGoing === null && (
        <div className="rsvp-section">
          <h3>Going out for lunch today?</h3>
          <div className="rsvp-buttons">
            <button className="rsvp-btn going" onClick={() => handleRSVP(true)}>
              Yes, I'm in! 🎉
            </button>
            <button className="rsvp-btn not-going" onClick={() => handleRSVP(false)}>
              Not today 😴
            </button>
          </div>
        </div>
      )}

      {isGoing === true && (
        <>
          <div className="rsvp-status is-going">
            You're in! ({goingCount} going)
            <br />
            <button className="rsvp-change" onClick={() => handleRSVP(false)}>
              Changed my mind
            </button>
          </div>

          <div className="tabs">
            <button
              className={`tab-btn ${activeTab === 'browse' ? 'active' : ''}`}
              onClick={() => setActiveTab('browse')}
            >
              Browse
            </button>
            <button
              className={`tab-btn ${activeTab === 'vote' ? 'active' : ''}`}
              onClick={() => setActiveTab('vote')}
            >
              Nominations
              {suggestions.length > 0 && <span className="badge">{suggestions.length}</span>}
            </button>
          </div>

          {activeTab === 'browse' && (
            <RestaurantBrowser
              onNominate={isClosed ? undefined : handleNominate}
              nominatedIds={nominatedIds}
            />
          )}

          {activeTab === 'vote' && (
            <VotingBoard
              suggestions={suggestions}
              votes={votes}
              myVote={myVote?.suggestion_id}
              onVote={handleVote}
              sessionStatus={session?.status}
            />
          )}

          {!isClosed && suggestions.length > 0 && (
            <div className="close-section">
              <button className="btn-close-session" onClick={handleClose}>
                Close Voting & Reveal Winner 🏆
              </button>
            </div>
          )}

          {isClosed && (
            <div className="close-section">
              <p style={{ color: 'var(--text-muted)', marginBottom: 8 }}>Voting is closed</p>
              <button className="btn-reopen" onClick={handleReopen}>
                Reopen voting
              </button>
              {winner && (
                <button
                  className="btn-secondary"
                  style={{ marginTop: 12 }}
                  onClick={() => setShowResults(true)}
                >
                  Show winner again 🏆
                </button>
              )}
            </div>
          )}
        </>
      )}

      {isGoing === false && (
        <div className="rsvp-section">
          <div className="rsvp-status not-going-msg">
            <p style={{ fontSize: 18, marginBottom: 8 }}>No worries! Enjoy your lunch 🍱</p>
            <button className="rsvp-change" onClick={() => handleRSVP(true)}>
              Changed my mind — I'm in!
            </button>
          </div>
        </div>
      )}

      {showResults && winner && (
        <Results winner={winner} onDismiss={() => setShowResults(false)} />
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
