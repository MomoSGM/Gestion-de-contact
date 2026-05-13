import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import ContactForm from './componenent/ContactForm'
import Login from './componenent/Login'
import ProtectedRoute from './componenent/ProtectedRoute'

function ContactsPage() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <>
      <button onClick={handleLogout}>Déconnexion</button>
      <ContactForm />
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <h1>Gestion de contacts</h1>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/contacts"
          element={
            <ProtectedRoute>
              <ContactsPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/contacts" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
