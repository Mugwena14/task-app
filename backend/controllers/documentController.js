const mongoose = require('mongoose')
const multer = require('multer')
const { GridFsStorage } = require('multer-gridfs-storage')
const Grid = require('gridfs-stream')
const Document = require('../models/documentModel')
const dotenv = require('dotenv')

dotenv.config()

const mongoURI = process.env.MONGO_URI
const conn = mongoose.createConnection(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

// Init gfs
let gfs, gridfsBucket
conn.once('open', () => {
  gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: 'uploads',
  })
  gfs = Grid(conn.db, mongoose.mongo)
  gfs.collection('uploads')
})

// GridFS storage engine
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => ({
    filename: `${Date.now()}-${file.originalname}`,
    bucketName: 'uploads',
  }),
})

const upload = multer({ storage })

// @desc Upload document
// @route POST /api/documents
// @access Private
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

// @desc Get all user documents
// @route GET /api/documents
// @access Private
const getDocuments = async (req, res) => {
  try {
    const documents = await Document.find({ user: req.user.id }).sort({ createdAt: -1 })
    res.json(documents)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching documents' })
  }
}

// @desc Download single document
// @route GET /api/documents/:id
// @access Private
const getDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id)
    if (!document) return res.status(404).json({ message: 'Document not found' })

    // Find file from GridFS by filename
    const files = await gfs.files.find({ filename: document.filename }).toArray()
    if (!files || files.length === 0) {
      return res.status(404).json({ message: 'No file found in storage' })
    }

    const file = files[0]

    res.set({
      'Content-Type': file.contentType || 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${file.filename}"`,
    })

    const downloadStream = gridfsBucket.openDownloadStream(file._id)
    downloadStream.on('error', (err) => {
      console.error('Download error:', err)
      res.status(500).json({ message: 'Error streaming file' })
    })
    downloadStream.pipe(res)
  } catch (error) {
    console.error('Error retrieving document:', error)
    res.status(500).json({ message: 'Error retrieving document' })
  }
}

// @desc Delete document
// @route DELETE /api/documents/:id
// @access Private
const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id)
    if (!document) return res.status(404).json({ message: 'Document not found' })

    if (document.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' })
    }

    const files = await gfs.files.find({ filename: document.filename }).toArray()
    if (!files || files.length === 0) {
      return res.status(404).json({ message: 'No file found to delete' })
    }

    await gridfsBucket.delete(files[0]._id)
    await document.deleteOne()

    res.json({ message: 'Document deleted successfully' })
  } catch (error) {
    console.error('Error deleting document:', error)
    res.status(500).json({ message: 'Error deleting document' })
  }
}

module.exports = {
  uploadDocument,
  getDocuments,
  getDocument,
  deleteDocument,
}
