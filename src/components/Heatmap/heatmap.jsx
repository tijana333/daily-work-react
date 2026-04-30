function Heatmap() {
  const today = new Date();

  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const monthName = today.toLocaleString("en-US", {
    month: "long",
  });

  const days = Array.from({ length: daysInMonth }, (_, index) => index + 1);

  return (
    <section className="heatmap-section">
      <div className="carousel">
        <button type="button">‹</button>

        <h2 id="current-month">
          {monthName} {currentYear}
        </h2>

        <button type="button">›</button>
      </div>

      <div className="heatmap-container">
        <div className="heatmap-box has-data">
          <div className="heatmap-grid">
            {days.map((day) => (
              <div key={day} className="heatmap-day"></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Heatmap;
