import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import Documents from './pages/Document'
import Notes from './pages/Notes'
import SearchPage from './pages/Search'
import Login from './pages/Login'
import Register from './pages/Register'
import NotFound from "./pages/NotFound";

function App() {
  return (
    <>
      <Router>
        <div className='container'>
          <Routes>
            <Route path='/register' element={<Register />} />
            <Route path='/login' element={<Login />} />
            <Route path='/' element={<Dashboard />} />
            <Route path='/documents' element={<Documents />} />
            <Route path='/notes' element={<Notes />} />
            <Route path='/search' element={<SearchPage />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </div>
      </Router>
      <ToastContainer />
    </>
  )
}

export default App
