function EntryCard({ entry }) {
  return (
    <div className="entry-card">
      <div className="entry-date">{entry.date}</div>

      <div className="entry-content">
        <div className="hours">{entry.hours}h</div>
        <div className="challenge">{entry.challenge}</div>
      </div>

      <div className="entry-intensity">{entry.intensity}</div>
    </div>
  );
}

export default EntryCard;
