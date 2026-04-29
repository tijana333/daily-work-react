import { useState } from "react";
import { Routes, Route, NavLink } from "react-router-dom";

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

      <div className="tabs">
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? "tab active" : "tab")}>
          Today
        </NavLink>

        <NavLink
          to="/overview"
          className={({ isActive }) => (isActive ? "tab active" : "tab")}>
          Overview
        </NavLink>

        <NavLink
          to="/entries"
          className={({ isActive }) => (isActive ? "tab active" : "tab")}>
          Entries
        </NavLink>
      </div>

      <Routes>
        <Route
          path="/"
          element={<EntryForm onEntryCreated={handleEntryCreated} />}
        />

        <Route
          path="/entries"
          element={
            <EntriesList
              refreshKey={refreshKey}
              onEntryClick={handleEntryClick}
            />
          }
        />

        <Route path="/overview" element={<h2>Overview coming soon...</h2>} />
      </Routes>

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
