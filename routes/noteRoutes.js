import { Router } from "express";
import Note from "../models/Note.js";
import { authMiddleware } from "../utils/auth.js";

const router = Router();

// Apply authMiddleware to all routes in this file
router.use(authMiddleware);

// GET /api/notes - Get all notes for the logged-in user
// THIS IS THE ROUTE THAT CURRENTLY HAS THE FLAW
router.get("/", async (req, res) => {
  // only the logged-in user's notes should be returned
	try {
		const notes = await Note.find({ user: req.user._id });
		res.json(notes);
	} catch (err) {
		res.status(500).json(err);
	}
});

// POST /api/notes - Create a new note
router.post("/", async (req, res) => {
	try {
		const note = await Note.create({
			...req.body,
			user: req.user._id, // Associate the note with the logged-in user
		});
		res.status(201).json(note);
	} catch (err) {
		res.status(400).json(err);
	}
});

// PUT /api/notes/:id - Update a note
router.put("/:id", async (req, res) => {
	try {
		// find the note
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: 'No note found with this id!' });
    }
    // only the owner may update the note
    if (note.user?.toString() !== req.user._id) {
      return res.status(403).json({ message: 'User is not authorized to update this note!' });
    }
    // owner confirmed, update the note
    const { user, ...updates } = req.body; // Exclude the user field from updates
    note.set(updates);
    const updated = await note.save();
    res.json(updated);
	} catch (err) {
		res.status(500).json(err);
	}
});

// DELETE /api/notes/:id - Delete a note
router.delete("/:id", async (req, res) => {
	try {
    // find the note
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: 'No note found with this id!' });
    }
    // only the owner may delete the note
    if (note.user?.toString() !== req.user._id) {
      return res.status(403).json({ message: 'User is not authorized to delete this note!' });
    }
    // owner confirmed, delete the note
    await note.deleteOne();
    res.json({ message: 'Note deleted successfully!' });
	} catch (err) {
		res.status(500).json(err);
	}
});
export default router;
