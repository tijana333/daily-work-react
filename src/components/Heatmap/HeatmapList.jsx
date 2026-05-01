import { useEffect, useState } from "react";

const API_URL = "https://daily-work-backend.vercel.app/api/entries";

function Heatmap() {
  const [activeMonth, setActiveMonth] = useState(new Date());
  const [heatmapEntries, setHeatmapEntries] = useState([]);
  const [tooltip, setTooltip] = useState({
    visible: false,
    content: "",
    x: 0,
    y: 0,
  });

  const activeYear = activeMonth.getFullYear();
  const activeMonthIndex = activeMonth.getMonth();

  const daysInMonth = new Date(activeYear, activeMonthIndex + 1, 0).getDate();

  const monthName = activeMonth.toLocaleString("en-US", {
    month: "long",
  });

  const days = Array.from({ length: daysInMonth }, (_, index) => index + 1);

  useEffect(() => {
    async function fetchHeatmapEntries() {
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("Failed to fetch entries");
        }

        const result = await response.json();

        const entriesForMonth = result.data.filter((entry) => {
          const entryDate = new Date(entry.date);

          return (
            entryDate.getFullYear() === activeYear &&
            entryDate.getMonth() === activeMonthIndex
          );
        });

        setHeatmapEntries(entriesForMonth);
      } catch (error) {
        console.error(error);
        setHeatmapEntries([]);
      }
    }

    fetchHeatmapEntries();
  }, [activeMonth]);

  function goToPreviousMonth() {
    setActiveMonth(new Date(activeYear, activeMonthIndex - 1, 1));
  }

  function goToNextMonth() {
    setActiveMonth(new Date(activeYear, activeMonthIndex + 1, 1));
  }

  function getEntryForDay(day) {
    return heatmapEntries.find((entry) => {
      const entryDate = new Date(entry.date);
      return entryDate.getDate() === day;
    });
  }

  function handleMouseEnter(event, entry) {
    if (!entry) return;

    setTooltip({
      visible: true,
      content: `${entry.date} | ${entry.hours}h | Intensity ${entry.intensity}`,
      x: event.clientX,
      y: event.clientY,
    });
  }

  function handleMouseLeave() {
    setTooltip({
      visible: false,
      content: "",
      x: 0,
      y: 0,
    });
  }

  const totalHours = heatmapEntries.reduce((sum, entry) => {
    return sum + Number(entry.hours);
  }, 0);

  const daysLogged = heatmapEntries.length;

  const averageIntensity =
    daysLogged > 0
      ? (
          heatmapEntries.reduce((sum, entry) => {
            return sum + Number(entry.intensity);
          }, 0) / daysLogged
        ).toFixed(1)
      : 0;

  return (
    <section className="heatmap-section">
      <div className="carousel">
        <button type="button" onClick={goToPreviousMonth}>
          ‹
        </button>

        <h2 id="current-month">
          {monthName} {activeYear}
        </h2>

        <button type="button" onClick={goToNextMonth}>
          ›
        </button>
      </div>

      <div className="heatmap-container">
        <div className="heatmap-box has-data">
          <div className="heatmap-grid">
            {days.map((day) => {
              const entry = getEntryForDay(day);

              return (
                <div
                  key={day}
                  className={
                    entry
                      ? `heatmap-day level-${entry.intensity}`
                      : "heatmap-day"
                  }
                  onMouseEnter={(event) => handleMouseEnter(event, entry)}
                  onMouseLeave={handleMouseLeave}></div>
              );
            })}
          </div>

          {tooltip.visible && (
            <div
              className="heatmap-tooltip"
              style={{
                display: "block",
                left: `${tooltip.x}px`,
                top: `${tooltip.y - 40}px`,
              }}>
              {tooltip.content}
            </div>
          )}
        </div>
      </div>

      <div className="stats-section">
        <div className="stat-card">
          <div className="stat-content">
            <span className="stat-value">{totalHours}</span>
            <span className="stat-label">Total Hours</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <span className="stat-value">{daysLogged}</span>
            <span className="stat-label">Days Logged</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <span className="stat-value">{averageIntensity}</span>
            <span className="stat-label">Average Intensity</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Heatmap;
