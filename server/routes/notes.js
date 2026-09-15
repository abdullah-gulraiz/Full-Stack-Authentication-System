const express = require("express");
const mongoose = require("mongoose");
const protect = require("../middleware/auth");

const router = express.Router();

// ── Inline Note schema (small enough to colocate) ────────────────────
const noteSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    body: { type: String, default: "", maxlength: 5000 },
  },
  { timestamps: true }
);

const Note = mongoose.model("Note", noteSchema);

// All routes below require authentication
router.use(protect);

// ─── GET /api/notes — list current user's notes ──────────────────────
router.get("/", async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user._id }).sort({ updatedAt: -1 });
    res.json(notes);
  } catch (err) {
    console.error("Fetch notes error:", err);
    res.status(500).json({ message: "Could not fetch notes" });
  }
});

// ─── POST /api/notes — create a note ─────────────────────────────────
router.post("/", async (req, res) => {
  try {
    const { title, body } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }
    const note = await Note.create({ user: req.user._id, title: title.trim(), body });
    res.status(201).json(note);
  } catch (err) {
    console.error("Create note error:", err);
    res.status(500).json({ message: "Could not create note" });
  }
});

// ─── DELETE /api/notes/:id — delete a note ────────────────────────────
router.delete("/:id", async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id, // ensure ownership
    });
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.json({ message: "Note deleted" });
  } catch (err) {
    console.error("Delete note error:", err);
    res.status(500).json({ message: "Could not delete note" });
  }
});

module.exports = router;
