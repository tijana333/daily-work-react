import { useState } from "react";

function EntryForm() {
  const todayDate = new Date().toISOString().substring(0, 10);
  const [date, setDate] = useState(todayDate);
  const [hours, setHours] = useState("");
  const [challenge, setChallenge] = useState("");
  const [note, setNote] = useState("");
  const [intensity, setIntensity] = useState(1);
  return (
    <form id="entry-form">
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
          onChange={(e) => setDate(e.target.value)}
        />
        <span id="date-error" className="catch-error"></span>
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
          onChange={(e) => setHours(e.target.value)}
        />
        <span id="hours-error" className="catch-error"></span>
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
          onChange={(e) => setChallenge(e.target.value)}
        />
        <span id="challenge-error" className="catch-error"></span>
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
          onChange={(e) => setNote(e.target.value)}></textarea>
        <span id="note-error" className="catch-error"></span>
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
