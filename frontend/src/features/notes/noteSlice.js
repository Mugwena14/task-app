import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import noteService from './noteService'

const initialState = {
  notes: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
}

//  Create new note
export const createNote = createAsyncThunk(
  'notes/create',
  async (noteData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await noteService.createNote(noteData, token)
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

//  Get all notes for user
export const getNotes = createAsyncThunk('notes/getAll', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token
    return await noteService.getNotes(token)
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})

//  Delete note
export const deleteNote = createAsyncThunk('notes/delete', async (id, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token
    return await noteService.deleteNote(id, token)
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})

//  Update note
export const updateNote = createAsyncThunk(
  'notes/update',
  async ({ id, noteData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await noteService.updateNote(id, noteData, token)
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

//  Summarize note
export const summarizeNote = createAsyncThunk(
  'notes/summarize',
  async (noteId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await noteService.summarizeNote(noteId, token)
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

//  Restore original
export const restoreOriginal = createAsyncThunk(
  'notes/restore',
  async (noteId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await noteService.restoreOriginal(noteId, token)
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const noteSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      //  CREATE
      .addCase(createNote.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createNote.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.notes.push(action.payload)
      })
      .addCase(createNote.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })

      //  GET ALL
      .addCase(getNotes.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getNotes.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.notes = action.payload
      })
      .addCase(getNotes.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })

      //  DELETE
      .addCase(deleteNote.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deleteNote.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.notes = state.notes.filter((note) => note._id !== action.payload.id)
      })
      .addCase(deleteNote.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })

      //  UPDATE
      .addCase(updateNote.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateNote.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.notes = state.notes.map((note) =>
          note._id === action.payload._id ? action.payload : note
        )
      })
      .addCase(updateNote.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })

      //  SUMMARIZE
      .addCase(summarizeNote.pending, (state) => {
        state.isLoading = true
      })
      .addCase(summarizeNote.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.message = action.payload.message

        const note = state.notes.find((n) => n._id === action.meta.arg)
        if (note) {
          note.summary = action.payload.summary
          note.content = action.payload.summary 
        }
      })
      .addCase(summarizeNote.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })

      //  RESTORE ORIGINAL
      .addCase(restoreOriginal.pending, (state) => {
        state.isLoading = true
      })
      .addCase(restoreOriginal.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.message = action.payload.message

        const note = state.notes.find((n) => n._id === action.meta.arg)
        if (note) {
          note.summary = ''
          note.content = note.originalContent || note.content 
        }
      })
      .addCase(restoreOriginal.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  },
})

export const { reset } = noteSlice.actions
export default noteSlice.reducer
