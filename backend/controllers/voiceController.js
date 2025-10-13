const fs = require('fs')
const path = require('path')
const OpenAI = require('openai')
const Goal = require('../models/goalModel')

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

// Ensure folder exists
const uploadDir = path.join(__dirname, '../uploads')
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir)

// POST /api/voice || takes the recording and make it a task
const transcribeAndCreateGoal = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No audio file provided' })

    // File path
    const filePath = path.resolve(req.file.path)

    // Check if file actually exists
    if (!fs.existsSync(filePath)) {
      return res.status(500).json({ message: 'Uploaded file not found' })
    }

    // Transcribe audio using OpenAI Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: 'whisper-1',
      response_format: 'text'
    })

    const transcriptText = transcription.text.trim()

    // Create goal in MongoDB
    const newGoal = await Goal.create({
      user: req.user.id,     
      text: transcriptText,
      source: 'voice',
      raw_text: transcriptText,
      audioReference: null      // deleted file, so keep null
    })

    // Delete the recording
    fs.unlink(filePath, err => {
      if (err) console.error('Failed to delete audio file:', err)
    })

    res.status(201).json({
      success: true,
      message: 'Goal created from voice successfully',
      goal: newGoal
    })

  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: 'Error processing audio',
      error: error.message
    })
  }
}

module.exports = { transcribeAndCreateGoal }
