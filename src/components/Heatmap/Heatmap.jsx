import { useEffect, useRef, useState } from "react";
import { loadEntries } from "../../api/entriesApi";
import { parseLocalDate } from "../../utils/dates";

function Heatmap() {
  const [activeMonth, setActiveMonth] = useState(new Date());
  const [heatmapEntries, setHeatmapEntries] = useState([]);
  // "loading" | "ready" | "error"
  const [status, setStatus] = useState("loading");
  const boxRef = useRef(null);
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
    // Set to true when the month changes before this request finishes,
    // so a slow response for the previous month is not shown
    let ignore = false;

    async function fetchHeatmapEntries() {
      setStatus("loading");
      try {
        const response = await loadEntries({
          month: activeMonthIndex + 1,
          year: activeYear,
        });
        if (ignore) return;

        if (!response.ok) {
          throw new Error("Failed to fetch entries");
        }

        setHeatmapEntries(response.data.data || []);
        setStatus("ready");
      } catch {
        if (ignore) return;
        setHeatmapEntries([]);
        setStatus("error");
      }
    }

    fetchHeatmapEntries();
    return () => {
      ignore = true;
    };
  }, [activeYear, activeMonthIndex]);

  function goToPreviousMonth() {
    setActiveMonth(new Date(activeYear, activeMonthIndex - 1, 1));
  }

  function goToNextMonth() {
    setActiveMonth(new Date(activeYear, activeMonthIndex + 1, 1));
  }

  function getEntryForDay(day) {
    return heatmapEntries.find((entry) => {
      return parseLocalDate(entry.date).getDate() === day;
    });
  }

  function handleMouseEnter(event, entry) {
    if (!entry) return;

    // The tooltip is absolutely positioned inside .heatmap-box, so its
    // position is measured from the box, not from the screen
    const square = event.currentTarget.getBoundingClientRect();
    const box = boxRef.current.getBoundingClientRect();

    setTooltip({
      visible: true,
      content: `${entry.date} | ${entry.hours}h | Intensity ${entry.intensity}`,
      x: square.left - box.left + square.width / 2,
      y: square.top - box.top + square.height + 12,
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

  // While loading, the empty grid is shown instead of "No data yet"
  const hasData = status === "loading" || heatmapEntries.length > 0;

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
        <div
          ref={boxRef}
          className={`heatmap-box ${hasData ? "has-data" : ""}`}>
          {!hasData && (
            <div className="heatmap-empty-state">
              <h2 className="heatmap-empty-title">
                {status === "error" ? "Could not load data" : "No data yet"}
              </h2>
              <p className="heatmap-empty">
                {status === "error"
                  ? "Check your connection and try again."
                  : "Start logging your daily work to see your progress here."}
              </p>
            </div>
          )}

          {hasData && (
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
          )}

          {tooltip.visible && (
            <div
              className="heatmap-tooltip"
              style={{
                display: "block",
                left: `${tooltip.x}px`,
                top: `${tooltip.y}px`,
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
