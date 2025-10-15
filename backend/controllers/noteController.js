const asyncHandler = require('express-async-handler')
const OpenAI = require('openai')
const Note = require('../models/noteModel')

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

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

// @desc    Summarize a note using GPT-4o-mini
// @route   POST /api/notes/:id/summarize
// @access  Private
const summarizeNote = asyncHandler(async (req, res) => {
    const note = await Note.findById(req.params.id)

    if (!note) {
        res.status(404)
        throw new Error('Note not found')
    }

    // Check ownership
    if (note.user.toString() !== req.user.id) {
        res.status(401)
        throw new Error('Not authorized to summarize this note')
    }

    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content:
                        'You are a helpful assistant that summarizes notes clearly and concisely in 2–4 sentences.',
                },
                {
                    role: 'user',
                    content: `Summarize the following note:\n\n${note.content}`,
                },
            ],
            temperature: 0.3,
            max_tokens: 150,
        })

        const summary = completion.choices[0].message.content.trim()

        res.status(200).json({
            success: true,
            summary,
        })
    } catch (error) {
        console.error('Summarization error:', error)
        res.status(500)
        throw new Error('Failed to summarize note')
    }
})

module.exports = {
    getNotes,
    createNote,
    updateNote,
    deleteNote,
    summarizeNote, 
}
