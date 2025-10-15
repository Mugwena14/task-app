import axios from 'axios'

const API_URL = '/api/notes/'

// Create a new note
const createNote = async (noteData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.post(API_URL, noteData, config)
  return response.data
}

// Get all notes for the user
const getNotes = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.get(API_URL, config)
  return response.data
}

// Delete a note
const deleteNote = async (noteId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.delete(`${API_URL}${noteId}`, config)
  return response.data
}

// Update a note
const updateNote = async (noteId, noteData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.put(`${API_URL}${noteId}`, noteData, config)
  return response.data
}

// Summarize a note
const summarizeNote = async (noteId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.post(`${API_URL}${noteId}/summarize`, {}, config)
  return response.data
}

// Restore original note
const restoreOriginal = async (noteId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.post(`${API_URL}${noteId}/restore`, {}, config)
  return response.data
}

const noteService = {
  createNote,
  getNotes,
  deleteNote,
  updateNote,
  summarizeNote,
  restoreOriginal,
}

export default noteService
