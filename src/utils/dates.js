// toISOString() returns the date in UTC, which is "yesterday" in Serbia
// between midnight and 1-2 AM, and new Date("YYYY-MM-DD") is parsed as
// UTC, which shifts the day in timezones behind UTC. These helpers always
// work with the local date.

// Date object -> "YYYY-MM-DD" in local time
export function toLocalDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getTodayDate() {
  return toLocalDateString(new Date());
}

// "YYYY-MM-DD" (or a full ISO string) -> Date at local midnight
export function parseLocalDate(dateString) {
  const [year, month, day] = dateString.substring(0, 10).split("-");
  return new Date(Number(year), Number(month) - 1, Number(day));
}
