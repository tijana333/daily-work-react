const API_URL = "https://daily-work-backend.vercel.app/api/entries";

// Every request returns { status, ok, data }.
// DELETE may return an empty body, so data can be null.
async function request(url, options) {
  const response = await fetch(url, options);
  const text = await response.text();
  return {
    status: response.status,
    ok: response.ok,
    data: text ? JSON.parse(text) : null,
  };
}

function jsonOptions(method, body) {
  return {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}

// Without arguments loads all entries,
// with { month, year } loads only that month (month is 1-12)
export function loadEntries({ month, year } = {}) {
  const url = month && year ? `${API_URL}?month=${month}&year=${year}` : API_URL;
  return request(url);
}

export function loadEntryByDate(date) {
  return request(`${API_URL}?date=${date}`);
}

export function submitEntry(entry) {
  return request(API_URL, jsonOptions("POST", entry));
}

export function updateEntry(id, entry) {
  return request(`${API_URL}/${id}`, jsonOptions("PUT", entry));
}

export function deleteEntry(id) {
  return request(`${API_URL}/${id}`, { method: "DELETE" });
}
