import { useEffect, useState } from 'react';

const CONFETTI_COLORS = ['#FF6B35', '#FDCB6E', '#00B894', '#FF7675', '#6C5CE7', '#FD79A8', '#00CEFF'];

function ConfettiPiece({ index }) {
  const color = CONFETTI_COLORS[index % CONFETTI_COLORS.length];
  const left = Math.random() * 100;
  const delay = Math.random() * 2;
  const size = 6 + Math.random() * 8;
  const shape = Math.random() > 0.5 ? '50%' : '0';

  return (
    <div
      className="confetti"
      style={{
        left: `${left}%`,
        width: size,
        height: size,
        background: color,
        borderRadius: shape,
        animationDelay: `${delay}s`,
        animationDuration: `${2 + Math.random() * 2}s`
      }}
    />
  );
}

export default function Results({ winner, onDismiss }) {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!winner) return null;

  const mapsQuery = encodeURIComponent(winner.name + ' ' + (winner.address || ''));
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

  return (
    <>
      {showConfetti && (
        <div className="confetti-container">
          {Array.from({ length: 60 }, (_, i) => (
            <ConfettiPiece key={i} index={i} />
          ))}
        </div>
      )}

      <div className="results-overlay" onClick={onDismiss}>
        <div className="results-card" onClick={e => e.stopPropagation()}>
          <div className="trophy">🏆</div>
          <h2>We have a winner!</h2>

          {winner.photo_url && (
            <img
              className="winner-photo"
              src={winner.photo_url}
              alt={winner.name}
              onError={e => { e.target.style.display = 'none'; }}
            />
          )}

          <div className="winner-name">{winner.name}</div>
          <div className="winner-meta">
            <span className="star">★</span> {winner.rating} · {winner.cuisine} · {winner.avg_price}/person · 🚶 {winner.walk_time} min
          </div>
          <div className="winner-votes">
            {winner.vote_count} {winner.vote_count === 1 ? 'vote' : 'votes'}
          </div>

          <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="btn-maps">
            📍 Open in Google Maps
          </a>

          <br />
          <button className="btn-dismiss" onClick={onDismiss}>Close</button>
        </div>
      </div>
    </>
  );
}
