import axios from 'axios'

const API_URL = '/api/documents/'

// Upload document
const uploadDocument = async (fileData, token) => {
  const formData = new FormData()
  formData.append('file', fileData)

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  }

  const response = await axios.post(API_URL, formData, config)
  return response.data
}

// Get all documents
const getDocuments = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.get(API_URL, config)
  return response.data
}

// Get single document (for download or preview)
const getDocument = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    responseType: 'blob', // important for downloading files
  }

  const response = await axios.get(API_URL + id, config)
  return response.data
}

// Delete document
const deleteDocument = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.delete(API_URL + id, config)
  return response.data
}

const documentService = {
  uploadDocument,
  getDocuments,
  getDocument,
  deleteDocument,
}

export default documentService
