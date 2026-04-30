import { useEffect, useState } from "react";
import {
  Routes,
  Route,
  NavLink,
  useNavigate,
  useLocation,
} from "react-router-dom";

import EntryForm from "./components/EntryForm/EntryForm";
import EntriesList from "./components/EntriesList/EntriesList";
import EntryModal from "./components/EntryModal/EntryModal";
import Heatmap from "./components/Heatmap/Heatmap";
function App() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [entryToEdit, setEntryToEdit] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  function handleEntryCreated() {
    setRefreshKey((prev) => prev + 1);
  }

  function handleEntryUpdated() {
    setRefreshKey((prev) => prev + 1);
    setEntryToEdit(null);
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
    setEntryToEdit(entry);
    setIsModalOpen(false);
    setSelectedEntry(null);
    navigate("/");
  }

  useEffect(() => {
    if (location.pathname !== "/") {
      setEntryToEdit(null);
    }
  }, [location.pathname]);

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
          element={
            <EntryForm
              onEntryCreated={handleEntryCreated}
              entryToEdit={entryToEdit}
              onEntryUpdated={handleEntryUpdated}
            />
          }
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

        <Route path="/overview" element={<Heatmap />} />
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
