const express = require('express')
const router = express.Router()
const { textSearch, voiceSearch } = require('../controllers/searchController')
const { protect } = require('../middleware/authMiddleware')
const multer = require('multer')

// Multer setup 
const storage = multer.memoryStorage()
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } }) 


router.route('/').get(protect, textSearch)

router.route('/voice').post(protect, upload.single('file'), voiceSearch)

module.exports = router
