import { useState } from "react";

function EntryForm() {
  const [errors, setErrors] = useState({
    date: "",
    hours: "",
    challenge: "",
    note: "",
  });

  const todayDate = new Date().toISOString().substring(0, 10);

  const [date, setDate] = useState(todayDate);
  const [hours, setHours] = useState("");
  const [challenge, setChallenge] = useState("");
  const [note, setNote] = useState("");
  const [intensity, setIntensity] = useState(1);

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

  function handleSubmit(e) {
    e.preventDefault();

    const validationErrors = validate();

    if (Object.values(validationErrors).some((error) => error !== "")) {
      setErrors(validationErrors);
      return;
    }

    console.log("Form is valid");
  }

  return (
    <form id="entry-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <div className="form-label">
          <label htmlFor="date">
            Date <span className="required">*</span>
          </label>
        </div>

        <input
          type="date"
          id="date"
          name="date"
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
            setErrors((prev) => ({ ...prev, date: "" }));
          }}
        />

        {errors.date && (
          <span id="date-error" className="catch-error show">
            {errors.date}
          </span>
        )}
      </div>

      <div className="form-group">
        <div className="form-label">
          <label htmlFor="number">
            Hours worked <span className="required">*</span>
          </label>
        </div>

        <input
          id="number"
          type="number"
          name="number"
          min="0.5"
          max="24"
          step="0.5"
          placeholder="e.g., 8"
          value={hours}
          onChange={(e) => {
            setHours(e.target.value);
            setErrors((prev) => ({ ...prev, hours: "" }));
          }}
        />

        {errors.hours && (
          <span id="hours-error" className="catch-error show">
            {errors.hours}
          </span>
        )}
      </div>

      <div className="form-group">
        <div className="form-label">
          <label>Intensity</label>
        </div>

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
        <div className="form-label">
          <label htmlFor="text">
            Today's challenge <span className="required">*</span>
          </label>
        </div>

        <input
          type="text"
          id="text"
          name="text"
          placeholder="What was the main challenge today?"
          value={challenge}
          onChange={(e) => {
            setChallenge(e.target.value);
            setErrors((prev) => ({ ...prev, challenge: "" }));
          }}
        />
        {errors.challenge && (
          <span id="challenge-error" className="catch-error show">
            {errors.challenge}
          </span>
        )}
      </div>

      <div className="form-group">
        <div className="form-label">
          <label htmlFor="note">Personal note</label>
        </div>
        <textarea
          id="note"
          name="note"
          rows="5"
          placeholder="How are you feeling? Any reflections?"
          value={note}
          onChange={(e) => {
            setNote(e.target.value);
            setErrors((prev) => ({ ...prev, note: "" }));
          }}></textarea>
        {errors.note && (
          <span id="note-error" className="catch-error show">
            {errors.note}
          </span>
        )}{" "}
      </div>

      <div className="form-group">
        <button type="submit" className="button-form">
          <span>Save Entry</span>
        </button>

        <div id="success-message">Entry created successfully!</div>
        <div id="server-error"></div>
      </div>
    </form>
  );
}

export default EntryForm;
