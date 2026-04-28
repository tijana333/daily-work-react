import { useEffect, useState } from "react";
import EntryCard from "../EntryCard/EntryCard";

const API_URL = "https://daily-work-backend.vercel.app/api/entries";

function EntriesList({ onEntryClick, refreshKey }) {
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [view, setView] = useState("month");

  useEffect(() => {
    async function fetchEntries() {
      try {
        setIsLoading(true);
        setError("");

        const url = view === "month" ? `${API_URL}?view=month` : API_URL;

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Failed to fetch entries");
        }

        const result = await response.json();

        const sortedEntries = result.data.sort(
          (a, b) => new Date(b.date) - new Date(a.date),
        );

        setEntries(sortedEntries);
      } catch (error) {
        setError("Could not load entries.");
        setEntries([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchEntries();
  }, [view, refreshKey]);
  return (
    <section className="entries-section">
      <div className="entries-tabs">
        <button
          className={view === "month" ? "active" : ""}
          onClick={() => setView("month")}>
          This Month
        </button>

        <button
          className={view === "all" ? "active" : ""}
          onClick={() => setView("all")}>
          All Entries
        </button>
      </div>

      {isLoading && <p>Loading entries...</p>}

      {!isLoading && error && <p className="error-message">{error}</p>}

      {!isLoading && !error && entries.length === 0 && <p>No entries yet.</p>}

      {!isLoading && !error && entries.length > 0 && (
        <div className="entries-list">
          {entries.map((entry) => (
            <EntryCard key={entry._id} entry={entry} onClick={onEntryClick} />
          ))}
        </div>
      )}
    </section>
  );
}
export default EntriesList;
