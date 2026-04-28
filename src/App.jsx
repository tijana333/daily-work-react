import { useState } from "react";
import EntryForm from "./components/EntryForm/EntryForm";
import EntriesList from "./components/EntriesList/EntriesList";

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  function handleEntryCreated() {
    setRefreshKey((prev) => prev + 1);
  }

  function handleEntryClick(entry) {
    console.log("Clicked entry:", entry);
  }

  return (
    <div className="container">
      <header className="header">
        <div id="header-content">
          <h1 id="logo">Daily Work</h1>
          <p>Track your progress, one day at a time</p>
        </div>
      </header>

      <EntryForm onEntryCreated={handleEntryCreated} />

      <EntriesList refreshKey={refreshKey} onEntryClick={handleEntryClick} />
    </div>
  );
}

export default App;
