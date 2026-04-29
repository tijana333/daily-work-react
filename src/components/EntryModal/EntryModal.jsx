const API_URL = "https://daily-work-backend.vercel.app/api/entries";

function EntryModal({ entry, isOpen, onClose, onEdit, onDelete }) {
  if (!isOpen || !entry) {
    return null;
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this entry?",
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`${API_URL}/${entry._id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete entry");
      }

      onDelete();
      onClose();
    } catch (error) {
      console.error(error);
      alert("Could not delete entry.");
    }
  }

  function handleEdit() {
    onEdit(entry);
    onClose();
  }

  return (
    <div className="modal-overlay">
      <div className="modal-box" id="entry-details-modal">
        <button className="modal-close" onClick={onClose}>
          ×
        </button>

        <h2>Entry Details</h2>

        <div className="form-group">
          <label>Date</label>
          <input type="text" value={entry.date} disabled />
        </div>

        <div className="form-group">
          <label>Hours worked</label>
          <input type="text" value={entry.hours} disabled />
        </div>

        <div className="form-group">
          <label>Intensity</label>
          <input type="text" value={entry.intensity} disabled />
        </div>

        <div className="form-group">
          <label>Today's challenge</label>
          <textarea value={entry.challenge} disabled />
        </div>

        <div className="form-group">
          <label>Personal note</label>
          <textarea value={entry.note || ""} disabled />
        </div>

        <div className="modal-actions">
          <button id="edit-entry-btn" onClick={handleEdit}>
            Edit
          </button>

          <button id="delete-entry-btn" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default EntryModal;
