import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import goalReducer from '../features/goals/goalSlice'
import documentReducer from '../features/documents/documentSlice'
import noteReducer from '../features/notes/noteSlice'
import profileReducer from "../features/profile/profileSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    goals: goalReducer,
    documents: documentReducer,
    notes: noteReducer,
    profile: profileReducer,
  },
})
