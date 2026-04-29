import { useState } from "react";
import EntryForm from "./components/EntryForm/EntryForm";
import EntriesList from "./components/EntriesList/EntriesList";
import EntryModal from "./components/EntryModal/EntryModal";

function App() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  function handleEntryCreated() {
    setRefreshKey((prev) => prev + 1);
  }

  function handleEntryClick(entry) {
    setSelectedEntry(entry);
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setSelectedEntry(null);
    setIsModalOpen(false);
  }

  function handleDeleteEntry() {
    setRefreshKey((prev) => prev + 1);
  }

  function handleEditEntry(entry) {
    console.log("Edit entry:", entry);
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
      <EntryModal
        entry={selectedEntry}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onEdit={handleEditEntry}
        onDelete={handleDeleteEntry}
      />
    </div>
  );
}

export default App;
