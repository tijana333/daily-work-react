import { useEffect, useState } from "react";
import EntryCard from "../EntryCard/EntryCard";
import { loadEntries } from "../../api/entriesApi";

function EntriesList({ onEntryClick, refreshKey }) {
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [view, setView] = useState("month");

  useEffect(() => {
    // Set to true when view changes again before this request finishes,
    // so an older, slower response can't overwrite the newer one
    let ignore = false;

    async function fetchEntries() {
      setIsLoading(true);
      setError("");

      try {
        const now = new Date();
        const params =
          view === "month"
            ? { month: now.getMonth() + 1, year: now.getFullYear() }
            : {};

        const response = await loadEntries(params);
        if (ignore) return;

        if (!response.ok) {
          throw new Error("Failed to fetch entries");
        }

        const sortedEntries = [...(response.data.data || [])].sort((a, b) =>
          b.date.localeCompare(a.date),
        );
        setEntries(sortedEntries);
      } catch {
        if (ignore) return;
        setError("Could not load entries.");
        setEntries([]);
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    fetchEntries();
    return () => {
      ignore = true;
    };
  }, [view, refreshKey]);

  return (
    <section className="entries-section">
      <h2>Work Entries</h2>
      <div className="entries-toggle">
        <button
          className={`entries-button ${view === "month" ? "active" : ""}`}
          onClick={() => setView("month")}>
          This Month
        </button>

        <button
          className={`entries-button ${view === "all" ? "active" : ""}`}
          onClick={() => setView("all")}>
          All Entries
        </button>
      </div>

      {/* LOADING */}
      {isLoading && <p id="entries-loading">Loading entries...</p>}

      {/* ERROR */}
      {!isLoading && error && <p className="error-message">{error}</p>}

      {/* EMPTY STATE */}
      {!isLoading && !error && entries.length === 0 && (
        <div id="empty-state-message">
          <span id="no-entries">No entries yet</span>
          <span id="start-entries">Start tracking your progress!</span>
        </div>
      )}

      {/* LISTA */}
      {!isLoading && !error && entries.length > 0 && (
        <div id="entries-list">
          {entries.map((entry) => (
            <EntryCard key={entry._id} entry={entry} onClick={onEntryClick} />
          ))}
        </div>
      )}
    </section>
  );
}

export default EntriesList;
