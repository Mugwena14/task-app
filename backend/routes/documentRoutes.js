const express = require('express')
const router = express.Router()
const {
  uploadDocument,
  getDocuments,
  getDocument,
  deleteDocument,
} = require('../controllers/documentController')

const { protect } = require('../middleware/authMiddleware')

// Routes
router.route('/')
  .get(protect, getDocuments)     
  .post(protect, uploadDocument) 

router.route('/:id')
  .get(protect, getDocument)      
  .delete(protect, deleteDocument) 

module.exports = router
