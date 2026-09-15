import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { token, logout } = useAuth();

  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const fetchNotes = useCallback(async () => {
    try {
      const res = await fetch("/api/notes", { headers });
      if (res.status === 401) {
        logout();
        return;
      }
      if (!res.ok) throw new Error("Failed to load notes");
      const data = await res.json();
      setNotes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const addNote = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers,
        body: JSON.stringify({ title: title.trim() }),
      });
      if (res.status === 401) {
        logout();
        return;
      }
      if (!res.ok) throw new Error("Could not create note");
      const note = await res.json();
      setNotes((prev) => [note, ...prev]);
      setTitle("");
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteNote = async (id) => {
    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: "DELETE",
        headers,
      });
      if (res.status === 401) {
        logout();
        return;
      }
      if (!res.ok) throw new Error("Could not delete note");
      setNotes((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });

  if (loading) {
    return (
      <div className="loading-page">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h2>Your notes</h2>

      {error && <div className="alert alert-error">{error}</div>}

      <form className="note-form" onSubmit={addNote}>
        <input
          type="text"
          placeholder="Write a new note..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={120}
        />
        <button type="submit" className="btn btn-primary" disabled={!title.trim()}>
          Add
        </button>
      </form>

      {notes.length === 0 ? (
        <div className="empty-state">
          <p>📝</p>
          <p>No notes yet. Add one above to get started.</p>
        </div>
      ) : (
        <div className="notes-list">
          {notes.map((note) => (
            <div className="note-item" key={note._id}>
              <div>
                <div className="note-title">{note.title}</div>
                <div className="note-date">{formatDate(note.createdAt)}</div>
              </div>
              <button
                className="btn btn-danger"
                onClick={() => deleteNote(note._id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
