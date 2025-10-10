import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import documentService from './documentService'

// Initial state
const initialState = {
  documents: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
}

// Upload document
export const uploadDocument = createAsyncThunk(
  'documents/upload',
  async (file, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await documentService.uploadDocument(file, token)
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Get all documents
export const getDocuments = createAsyncThunk(
  'documents/getAll',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await documentService.getDocuments(token)
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Delete document
export const deleteDocument = createAsyncThunk(
  'documents/delete',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await documentService.deleteDocument(id, token)
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const documentSlice = createSlice({
  name: 'document',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Upload
      .addCase(uploadDocument.pending, (state) => {
        state.isLoading = true
      })
      .addCase(uploadDocument.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.documents.push(action.payload.document)
      })
      .addCase(uploadDocument.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      // Get All
      .addCase(getDocuments.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getDocuments.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.documents = action.payload
      })
      .addCase(getDocuments.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      // Delete
      .addCase(deleteDocument.fulfilled, (state, action) => {
        state.isSuccess = true
        state.documents = state.documents.filter(
          (doc) => doc._id !== action.meta.arg
        )
      })
  },
})

export const { reset } = documentSlice.actions
export default documentSlice.reducer
