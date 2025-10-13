const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const { transcribeAndCreateGoal } = require('../controllers/voiceController')
const { protect } = require('../middleware/authMiddleware') // JWT auth

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, '../uploads')
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir)

// Multer Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
})

// Multer upload 
const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB max
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'audio/wav',
      'audio/webm',
      'audio/mpeg',
      'audio/mp3',
      'audio/m4a',
      'audio/x-m4a',
      'audio/mp4'
    ]

    const allowedExts = ['.wav', '.webm', '.mp3', '.m4a', '.mp4']
    const ext = path.extname(file.originalname).toLowerCase()

    console.log('Uploaded file MIME:', file.mimetype, 'EXT:', ext)

    if (allowedMimes.includes(file.mimetype) || allowedExts.includes(ext)) {
      cb(null, true)
    } else {
      cb(new Error(`Unsupported file type: ${file.mimetype} (ext: ${ext})`))
    }
  }
})

// POST /api/voice -> upload + transcribe + create goal
router.post('/', protect, upload.single('audio'), transcribeAndCreateGoal)

module.exports = router
