const asyncHandler = require('express-async-handler')
const OpenAI = require('openai')
const Note = require('../models/noteModel')

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// @desc Get notes
const getNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find({ user: req.user.id }).sort({ updatedAt: -1 })
  res.status(200).json(notes)
})

// @desc Create note
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

// @desc Update note
const updateNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id)

  if (!note) {
    res.status(404)
    throw new Error('Note not found')
  }

  if (note.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error('Not authorized')
  }

  const updatedNote = await Note.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  })

  res.status(200).json(updatedNote)
})

// @desc Delete note
const deleteNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id)

  if (!note) {
    res.status(404)
    throw new Error('Note not found')
  }

  if (note.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error('Not authorized')
  }

  await note.deleteOne()

  res.status(200).json({ id: req.params.id })
})

// @desc Summarize note using OpenAI
const summarizeNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id)

  if (!note) {
    res.status(404)
    throw new Error('Note not found')
  }

  if (note.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error('Not authorized')
  }

  console.log('Summarizing note:', note._id)

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'You summarize notes concisely and clearly.' },
      { role: 'user', content: `Summarize this note:\n\n${note.content}` },
    ],
    temperature: 0.5,
    max_tokens: 200,
  })

  const summary = completion.choices?.[0]?.message?.content?.trim()
  if (!summary) {
    res.status(500)
    throw new Error('No summary generated')
  }

  note.summary = summary
  await note.save()

  res.status(200).json({
    success: true,
    message: 'Note summarized successfully',
    note,
  })
})

// @desc Restore original note
const restoreOriginal = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id)

  if (!note) {
    res.status(404)
    throw new Error('Note not found')
  }

  if (note.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error('Not authorized')
  }

  note.summary = ''
  await note.save()

  res.status(200).json({
    success: true,
    message: 'Original note restored successfully',
    note,
  })
})

module.exports = {
    getNotes,
    createNote,
    updateNote,
    deleteNote,
    summarizeNote,
    restoreOriginal,
}
