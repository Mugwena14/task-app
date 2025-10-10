const mongoose = require('mongoose')
const multer = require('multer')
const { GridFsStorage } = require('multer-gridfs-storage')
const Grid = require('gridfs-stream')
const Document = require('../models/documentModel')
const dotenv = require('dotenv')

dotenv.config()

const mongoURI = process.env.MONGO_URI

const conn = mongoose.createConnection(mongoURI)

// Init gfs
let gfs
conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo)
    gfs.collection('uploads')
})

// The Storage engine
const storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file) => {
        return {
        filename: `${Date.now()}-${file.originalname}`,
        bucketName: 'uploads',
        }
    },
})

const upload = multer({ storage })

// @desc    Upload a new document
// @route   POST /api/documents
// @access  Private
const uploadDocument = [
    upload.single('file'),
    async (req, res) => {
        try {
        const { file } = req
        if (!file) return res.status(400).json({ message: 'No file uploaded' })

        const document = await Document.create({
            user: req.user.id,
            filename: file.filename,
            originalname: file.originalname,
            contentType: file.contentType,
            size: file.size,
        })

        res.status(201).json({
            message: 'Document uploaded successfully',
            document,
        })
        } catch (error) {
        res.status(500).json({ message: 'Error uploading document', error })
        }
    },
]

// @desc    Get all documents for a user
// @route   GET /api/documents
// @access  Private
const getDocuments = async (req, res) => {
  try {
    const documents = await Document.find({ user: req.user.id }).sort({ createdAt: -1 })
    res.json(documents)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching documents' })
  }
}

// @desc    Get a single document (stream/download)
// @route   GET /api/documents/:id
// @access  Private
const getDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id)
    if (!document) return res.status(404).json({ message: 'Document not found' })

    gfs.files.findOne({ filename: document.filename }, (err, file) => {
      if (!file || file.length === 0) {
        return res.status(404).json({ message: 'No file found in storage' })
      }
      const readstream = gfs.createReadStream(file.filename)
      res.set('Content-Type', file.contentType)
      readstream.pipe(res)
    })
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving document' })
  }
}

// @desc    Delete a document
// @route   DELETE /api/documents/:id
// @access  Private
const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id)
    if (!document) return res.status(404).json({ message: 'Document not found' })

    // Ensure the user owns the document
    if (document.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' })
    }

    // Remove from GridFS
    gfs.remove({ filename: document.filename, root: 'uploads' }, async (err) => {
      if (err) return res.status(500).json({ message: 'Error deleting file' })

      await document.deleteOne()
      res.json({ message: 'Document deleted successfully' })
    })
  } catch (error) {
    res.status(500).json({ message: 'Error deleting document' })
  }
}

module.exports = {
  uploadDocument,
  getDocuments,
  getDocument,
  deleteDocument,
}
