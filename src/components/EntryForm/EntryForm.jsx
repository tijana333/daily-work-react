import { useState, useEffect } from "react";
import { submitEntry, updateEntry } from "../../api/entriesApi";

function EntryForm({ onEntryCreated, onEntryUpdated, entryToEdit }) {
  const todayDate = new Date().toISOString().substring(0, 10);

  const [date, setDate] = useState(todayDate);
  const [hours, setHours] = useState("");
  const [challenge, setChallenge] = useState("");
  const [note, setNote] = useState("");
  const [intensity, setIntensity] = useState(1);

  const [errors, setErrors] = useState({
    date: "",
    hours: "",
    challenge: "",
    note: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [serverError, setServerError] = useState("");
  const [editingEntryId, setEditingEntryId] = useState(null);

  useEffect(() => {
    if (entryToEdit) {
      setEditingEntryId(entryToEdit._id);
      setDate(entryToEdit.date);
      setHours(String(entryToEdit.hours));
      setChallenge(entryToEdit.challenge);
      setNote(entryToEdit.note || "");
      setIntensity(entryToEdit.intensity);
    }
  }, [entryToEdit]);

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
      const today = new Date().toISOString().substring(0, 10);
      if (date > today) {
        newErrors.date = "Date cannot be in the future.";
      }
    }

    if (!challenge.trim()) {
      newErrors.challenge = "Challenge is required.";
    } else if (challenge.length > 100) {
      newErrors.challenge = "Challenge must be 100 characters or less.";
    }

    if (note.length > 500) {
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
      challenge,
      note,
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
          onChange={(e) => {
            setDate(e.target.value);
            setErrors((prev) => ({ ...prev, date: "" }));
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
