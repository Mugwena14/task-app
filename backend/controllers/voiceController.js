const fs = require('fs')
const OpenAI = require('openai')
const path = require('path')
const Goal = require('../models/goalModel')

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

// POST /api/voice/transcribe
const transcribeAndCreateGoal = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No audio file provided' })
    }

    const filePath = path.resolve(req.file.path)

    // Transcribing audio using Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: 'whisper-1',
      response_format: 'text',
    })

    const transcriptText = transcription.text.trim()

    // Create a new Goal in MongoDB
    const newGoal = await Goal.create({
      user: req.user.id,        
      text: transcriptText,     
      source: 'voice',          
      raw_text: transcriptText, 
      audioReference: null // deleted after creation
    })

    // Delete the audio vn
    fs.unlink(filePath, err => {
      if (err) console.error('Error deleting audio file:', err)
    })

    // Response
    res.status(201).json({
      success: true,
      message: 'Goal created successfully from voice',
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
