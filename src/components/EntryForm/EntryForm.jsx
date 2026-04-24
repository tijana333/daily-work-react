function EntryForm() {
  return (
    <form id="entry-form">
      <div className="form-group">
        <div className="form-label">
          <label htmlFor="date">
            Date <span className="required">*</span>
          </label>
        </div>
        <input type="date" id="date" name="date" />
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
        />
        <span id="hours-error" className="catch-error"></span>
      </div>

      <div className="form-group">
        <div className="form-label">
          <label>Intensity</label>
        </div>

        <div className="buttons">
          <button type="button" className="intensity-button">
            <span className="tab-number">1</span>
            <span className="tab-text">Light</span>
          </button>
          <button type="button" className="intensity-button">
            <span className="tab-number">2</span>
            <span className="tab-text">Easy</span>
          </button>
          <button type="button" className="intensity-button">
            <span className="tab-number">3</span>
            <span className="tab-text">Moderate</span>
          </button>
          <button type="button" className="intensity-button">
            <span className="tab-number">4</span>
            <span className="tab-text">Intense</span>
          </button>
          <button type="button" className="intensity-button">
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
          placeholder="How are you feeling? Any reflections?"></textarea>
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
