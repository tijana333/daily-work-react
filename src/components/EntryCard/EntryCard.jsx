function EntryCard({ entry }) {
  return (
    <div className="entry-card">
      <div className="entry-date">{entry.date}</div>
      <div className="entry-hours">{entry.hours}</div>
      <div className="entry-challenge">{entry.challenge}</div>
    </div>
  );
}

export default EntryCard;
