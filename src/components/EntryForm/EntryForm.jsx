import { useState, useEffect, useCallback, useRef } from "react";
import {
  submitEntry,
  updateEntry,
  loadEntryByDate,
} from "../../api/entriesApi";
import { getTodayDate } from "../../utils/dates";

function EntryForm({ onEntryCreated, onEntryUpdated, entryToEdit }) {
  const todayDate = getTodayDate();

  // The form is mounted each time the "/" route opens, so an entry
  // chosen with Edit is used directly as the initial state
  const [date, setDate] = useState(entryToEdit?.date ?? todayDate);
  const [hours, setHours] = useState(
    entryToEdit ? String(entryToEdit.hours ?? "") : "",
  );
  const [challenge, setChallenge] = useState(entryToEdit?.challenge ?? "");
  const [note, setNote] = useState(entryToEdit?.note ?? "");
  const [intensity, setIntensity] = useState(entryToEdit?.intensity ?? 1);

  const [errors, setErrors] = useState({
    date: "",
    hours: "",
    challenge: "",
    note: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [serverError, setServerError] = useState("");
  const [editingEntryId, setEditingEntryId] = useState(
    entryToEdit?._id ?? null,
  );

  // The date of the latest lookup, so a slow response for a date
  // the user already changed is ignored
  const latestDateRef = useRef(entryToEdit?.date ?? null);

  const fillForm = useCallback((entry) => {
    setEditingEntryId(entry._id);
    setDate(entry.date);
    setHours(String(entry.hours ?? ""));
    setChallenge(entry.challenge || "");
    setNote(entry.note || "");
    setIntensity(entry.intensity || 1);
  }, []);

  // Clears everything except the date
  const clearEntryFields = useCallback(() => {
    setEditingEntryId(null);
    setHours("");
    setChallenge("");
    setNote("");
    setIntensity(1);
  }, []);

  // If the date already has an entry, load it so saving updates it
  // instead of failing with "Entry for this date already exists".
  // clearIfMissing: clear the fields when the date has no entry
  // (used when the form was showing another day's entry).
  const loadEntryForDate = useCallback(
    async (selectedDate, clearIfMissing) => {
      latestDateRef.current = selectedDate;
      try {
        const response = await loadEntryByDate(selectedDate);
        if (latestDateRef.current !== selectedDate) return;

        const entry = response.ok ? response.data?.data?.[0] : null;
        if (entry) {
          fillForm(entry);
        } else if (clearIfMissing) {
          clearEntryFields();
        }
      } catch {
        // If the lookup fails the form still works; saving reports errors
      }
    },
    [fillForm, clearEntryFields],
  );

  // Without an entry to edit, check whether today already has one
  useEffect(() => {
    if (!entryToEdit) {
      loadEntryForDate(getTodayDate(), false);
    }
  }, [entryToEdit, loadEntryForDate]);

  function validate() {
    const newErrors = {
      date: "",
      hours: "",
      challenge: "",
      note: "",
    };

    const hoursNumber = Number(hours);

    if (!hours) {
      newErrors.hours = "Hours are required.";
    } else if (Number.isNaN(hoursNumber)) {
      newErrors.hours = "Hours must be a number.";
    } else if (hoursNumber < 0 || hoursNumber > 24) {
      newErrors.hours = "Hours must be between 0 and 24.";
    }

    if (!date) {
      newErrors.date = "Date is required.";
    } else {
      if (date > getTodayDate()) {
        newErrors.date = "Date cannot be in the future.";
      }
    }

    if (!challenge.trim()) {
      newErrors.challenge = "Challenge is required.";
    } else if (challenge.trim().length > 100) {
      newErrors.challenge = "Challenge must be 100 characters or less.";
    }

    if (note.trim().length > 500) {
      newErrors.note = "Note must be 500 characters or less.";
    }

    return newErrors;
  }

  function resetForm() {
    setDate(todayDate);
    setHours("");
    setChallenge("");
    setNote("");
    setIntensity(1);
    setEditingEntryId(null);

    setErrors({
      date: "",
      hours: "",
      challenge: "",
      note: "",
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setSuccessMessage("");
    setServerError("");

    const validationErrors = validate();

    if (Object.values(validationErrors).some((error) => error !== "")) {
      setErrors(validationErrors);
      return;
    }

    const entry = {
      date,
      hours: Number(hours),
      challenge: challenge.trim(),
      note: note.trim(),
      intensity,
    };

    try {
      setIsLoading(true);

      const response = editingEntryId
        ? await updateEntry(editingEntryId, entry)
        : await submitEntry(entry);

      if (response.status === 201 || response.status === 200) {
        setSuccessMessage(
          editingEntryId
            ? "Entry updated successfully!"
            : "Entry created successfully!",
        );

        resetForm();
        // Today may now have an entry, so load it (Update Entry mode)
        loadEntryForDate(todayDate, false);

        if (editingEntryId) {
          onEntryUpdated?.();
        } else {
          onEntryCreated?.();
        }
      } else if (response.status === 409) {
        setServerError("Entry for this date already exists");
      } else {
        setServerError("Something went wrong. Please try again.");
      }
    } catch {
      setServerError("Failed to save entry");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form id="entry-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>
          Date <span className="required">*</span>
        </label>
        <input
          type="date"
          value={date}
          max={todayDate}
          onChange={(e) => {
            const value = e.target.value;
            setDate(value);
            setErrors((prev) => ({ ...prev, date: "" }));
            setSuccessMessage("");
            setServerError("");
            if (value) loadEntryForDate(value, editingEntryId !== null);
          }}
        />
        {errors.date && <span className="catch-error show">{errors.date}</span>}
      </div>

      <div className="form-group">
        <label>
          Hours worked <span className="required">*</span>
        </label>
        <input
          type="number"
          min="0"
          max="24"
          step="0.5"
          value={hours}
          onChange={(e) => {
            const value = e.target.value;

            if (Number(value) < 0) return;

            setHours(value);
            setErrors((prev) => ({ ...prev, hours: "" }));
          }}
        />
        {errors.hours && (
          <span className="catch-error show">{errors.hours}</span>
        )}
      </div>

      <div className="form-group">
        <label>Intensity</label>

        <div className="buttons">
          <button
            type="button"
            className={`intensity-button ${intensity === 1 ? "active" : ""}`}
            onClick={() => setIntensity(1)}>
            <span className="tab-number">1</span>
            <span className="tab-text">Light</span>
          </button>

          <button
            type="button"
            className={`intensity-button ${intensity === 2 ? "active" : ""}`}
            onClick={() => setIntensity(2)}>
            <span className="tab-number">2</span>
            <span className="tab-text">Easy</span>
          </button>

          <button
            type="button"
            className={`intensity-button ${intensity === 3 ? "active" : ""}`}
            onClick={() => setIntensity(3)}>
            <span className="tab-number">3</span>
            <span className="tab-text">Moderate</span>
          </button>

          <button
            type="button"
            className={`intensity-button ${intensity === 4 ? "active" : ""}`}
            onClick={() => setIntensity(4)}>
            <span className="tab-number">4</span>
            <span className="tab-text">Intense</span>
          </button>

          <button
            type="button"
            className={`intensity-button ${intensity === 5 ? "active" : ""}`}
            onClick={() => setIntensity(5)}>
            <span className="tab-number">5</span>
            <span className="tab-text">Maximum</span>
          </button>
        </div>
      </div>

      <div className="form-group">
        <label>
          Today's challenge <span className="required">*</span>
        </label>
        <input
          type="text"
          value={challenge}
          onChange={(e) => {
            setChallenge(e.target.value);
            setErrors((prev) => ({ ...prev, challenge: "" }));
          }}
        />
        {errors.challenge && (
          <span className="catch-error show">{errors.challenge}</span>
        )}
      </div>

      <div className="form-group">
        <label>Personal note</label>
        <textarea
          value={note}
          onChange={(e) => {
            setNote(e.target.value);
            setErrors((prev) => ({ ...prev, note: "" }));
          }}
        />
        {errors.note && <span className="catch-error show">{errors.note}</span>}
      </div>

      <div className="form-group">
        <button type="submit" className="button-form" disabled={isLoading}>
          <span>
            {isLoading
              ? editingEntryId
                ? "Updating..."
                : "Saving..."
              : editingEntryId
                ? "Update Entry"
                : "Save Entry"}
          </span>
        </button>
      </div>

      {successMessage && <div id="success-message">{successMessage}</div>}
      {serverError && <div id="server-error">{serverError}</div>}
    </form>
  );
}

export default EntryForm;
