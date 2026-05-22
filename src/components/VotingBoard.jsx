export default function VotingBoard({ suggestions, votes, myVote, onVote, sessionStatus }) {
  if (!suggestions || suggestions.length === 0) {
    return (
      <div className="empty-state">
        <div className="icon">📋</div>
        <p>No restaurants nominated yet.<br />Browse restaurants and nominate your favorites!</p>
      </div>
    );
  }

  const voteCounts = {};
  suggestions.forEach(s => { voteCounts[s.id] = 0; });
  votes.forEach(v => {
    if (voteCounts[v.suggestion_id] !== undefined) {
      voteCounts[v.suggestion_id]++;
    }
  });

  const sorted = [...suggestions].sort((a, b) => (voteCounts[b.id] || 0) - (voteCounts[a.id] || 0));
  const isClosed = sessionStatus === 'closed';

  return (
    <div className="voting-board">
      {sorted.map(s => {
        const count = voteCounts[s.id] || 0;
        const isMyVote = myVote === s.id;

        return (
          <div key={s.id} className={`vote-card ${isMyVote ? 'my-vote' : ''}`}>
            <div className="vote-card-body">
              {s.photo_url && (
                <img
                  className="vote-card-photo"
                  src={s.photo_url}
                  alt={s.name}
                  loading="lazy"
                  onError={e => { e.target.style.display = 'none'; }}
                />
              )}
              <div className="vote-card-info">
                <div className="card-name">{s.name}</div>
                <div className="card-meta">
                  <span className="card-rating">
                    <span className="star">★</span> {s.rating}
                  </span>
                  <span>({s.review_count})</span>
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
                  {s.cuisine} · {s.avg_price}/person · 🚶 {s.walk_time} min
                </div>
              </div>
            </div>
            <div className="vote-card-actions">
              <div className="vote-count">
                <strong>{count}</strong> {count === 1 ? 'vote' : 'votes'}
              </div>
              {!isClosed && (
                <button
                  className={`btn-vote ${isMyVote ? 'voted' : ''}`}
                  onClick={() => onVote(s.id)}
                >
                  {isMyVote ? '✓ Voted' : 'Vote'}
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
