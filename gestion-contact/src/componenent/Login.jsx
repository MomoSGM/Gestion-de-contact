import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'

function Login() {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!login || !password) return

    const response = await api.post('/login', { login, password })
    if (response.error) {
      setError(response.error)
      return
    }
    localStorage.setItem('token', response.token)
    navigate('/contacts')
  }

  return (
    <div>
      <h2>Connexion</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <label>
          Login :{' '}
          <input
            type="text"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
          />
        </label>
        <label>
          Mot de passe :{' '}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button type="submit">Se connecter</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}

export default Login
