import EntryCard from "./components/EntryCard/EntryCard";

function App() {
  const testEntry = {
    _id: "test-123",
    date: "2025-01-15",
    hours: 6,
    challenge: "Learning React components",
    intensity: 3,
  };

  return (
    <div>
      <h1>Daily Work</h1>
      <p>Track your progress, one day at a time</p>
      <EntryCard entry={testEntry} />
    </div>
  );
}

export default App;
