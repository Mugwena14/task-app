const asyncHandler = require('express-async-handler')
const Note = require('../models/noteModel')

// @desc    Get all notes for the logged-in user
// @route   GET /api/notes
// @access  Private
const getNotes = asyncHandler(async (req, res) => {
    const notes = await Note.find({ user: req.user.id }).sort({ updatedAt: -1 })
    res.status(200).json(notes)
})

// @desc    Create a new note
// @route   POST /api/notes
// @access  Private
const createNote = asyncHandler(async (req, res) => {
    const { title, content } = req.body

    if (!title || !content) {
        res.status(400)
        throw new Error('Please provide both title and content')
    }

    const note = await Note.create({
        user: req.user.id,
        title,
        content,
    })

    res.status(201).json(note)
})

// @desc    Update a note
// @route   PUT /api/notes/:id
// @access  Private
const updateNote = asyncHandler(async (req, res) => {
    const note = await Note.findById(req.params.id)

    if (!note) {
        res.status(404)
        throw new Error('Note not found')
    }

    // Check user ownership
    if (note.user.toString() !== req.user.id) {
        res.status(401)
        throw new Error('Not authorized')
    }

    const updatedNote = await Note.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    })

    res.status(200).json(updatedNote)
})

// @desc    Delete a note
// @route   DELETE /api/notes/:id
// @access  Private
const deleteNote = asyncHandler(async (req, res) => {
    const note = await Note.findById(req.params.id)

    if (!note) {
        res.status(404)
        throw new Error('Note not found')
    }

    // Check user ownership
    if (note.user.toString() !== req.user.id) {
        res.status(401)
        throw new Error('Not authorized')
    }

    await note.deleteOne()

    res.status(200).json({ id: req.params.id })
})

module.exports = {
    getNotes,
    createNote,
    updateNote,
    deleteNote,
}
