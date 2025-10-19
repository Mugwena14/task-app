const fs = require('fs')
const path = require('path')
const OpenAI = require('openai')
const Goal = require('../models/goalModel')

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, '../uploads')
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir)

// POST /api/voice || takes the recording and makes it a task
const transcribeAndCreateGoal = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No audio file provided' })
    }

    const filePath = path.resolve(req.file.path)

    // Verify if uploaded file exists
    if (!fs.existsSync(filePath)) {
      return res.status(500).json({ message: 'Uploaded file not found' })
    }

    // Transcribe using GPT-4o Mini Transcribe
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: 'gpt-4o-mini-transcribe',
      response_format: 'text'
    })

    // Handle text or object response 
    const transcriptText =
      typeof transcription === 'string'
        ? transcription.trim()
        : (transcription.text || '').trim()

    // Create goal in MongoDB
    const newGoal = await Goal.create({
      user: req.user.id,
      text: transcriptText,
      source: 'voice',
      raw_text: transcriptText,
      audioReference: null // file deleted after processing
    })

    // Delete temporary uploaded file
    fs.unlink(filePath, err => {
      if (err) console.error('Failed to delete audio file:', err)
    })

    res.status(201).json({
      success: true,
      message: 'Goal created from voice successfully',
      goal: newGoal
    })
  } catch (error) {
    console.error('Full error:', error.response ? error.response.data : error.message)
    res.status(500).json({
      success: false,
      message: 'Error processing audio',
      error: error.message
    })
  }
}

module.exports = { transcribeAndCreateGoal }
