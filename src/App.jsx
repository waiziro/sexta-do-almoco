import { useState, useEffect } from 'react';
import HomePage from './components/HomePage';
import JoinSession from './components/JoinSession';
import SessionPage from './components/SessionPage';
import ManageRestaurants from './components/ManageRestaurants';

export default function App() {
  const [sessionCode, setSessionCode] = useState(null);
  const [participant, setParticipant] = useState(null);
  const [page, setPage] = useState('home');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('s');
    if (code) setSessionCode(code.toUpperCase());
    if (params.get('manage') !== null) setPage('manage');

    const saved = sessionStorage.getItem('lunchParticipant');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.id) {
          setParticipant(parsed);
          if (parsed.session_code) setSessionCode(parsed.session_code);
        }
      } catch {}
    }
  }, []);

  function handleSessionCreated(code) {
    setSessionCode(code);
    setPage('home');
    window.history.replaceState(null, '', `?s=${code}`);
  }

  function handleJoined(p, code) {
    setParticipant(p);
    sessionStorage.setItem('lunchParticipant', JSON.stringify({ ...p, session_code: code }));
  }

  function handleLeave() {
    setParticipant(null);
    setSessionCode(null);
    sessionStorage.removeItem('lunchParticipant');
    window.history.replaceState(null, '', '/');
  }

  function goToManage() {
    setPage('manage');
    window.history.replaceState(null, '', '?manage');
  }

  function goHome() {
    setPage('home');
    setSessionCode(null);
    setParticipant(null);
    window.history.replaceState(null, '', '/');
  }

  if (page === 'manage') {
    return <ManageRestaurants onBack={goHome} />;
  }

  if (!sessionCode) {
    return <HomePage onSessionCreated={handleSessionCreated} onManage={goToManage} />;
  }

  if (!participant) {
    return (
      <JoinSession
        code={sessionCode}
        onJoined={(p) => handleJoined(p, sessionCode)}
        onBack={() => { setSessionCode(null); window.history.replaceState(null, '', '/'); }}
      />
    );
  }

  return (
    <SessionPage
      code={sessionCode}
      participant={participant}
      onLeave={handleLeave}
    />
  );
}
