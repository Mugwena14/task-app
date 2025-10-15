const express = require('express')
const router = express.Router()
const {
    getNotes,
    createNote,
    updateNote,
    deleteNote,
    summarizeNote, 
} = require('../controllers/noteController')

const { protect } = require('../middleware/authMiddleware')

// Get & Create Notes
router.route('/').get(protect, getNotes).post(protect, createNote)

// Update & Delete Notes
router.route('/:id').put(protect, updateNote).delete(protect, deleteNote)

// Summarize a Note
router.route('/:id/summarize').post(protect, summarizeNote) 

module.exports = router
