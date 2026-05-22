export default function ParticipantList({ participants }) {
  if (!participants || participants.length === 0) return null;

  return (
    <div className="participants-strip">
      {participants.map(p => {
        const status = p.is_going === null ? 'pending' : p.is_going ? 'going' : 'not-going';
        return (
          <div key={p.id} className={`participant-chip ${status}`}>
            <span className="dot" />
            <span>{p.nickname}</span>
          </div>
        );
      })}
    </div>
  );
}
