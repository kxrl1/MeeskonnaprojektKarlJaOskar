import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/pages/loginPage.css'

// Ajutine mock kasutaja kuni backend on valmis
const MOCK_USER = {
  email: 'karl@test.ee',
  password: '1234'
}

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  function handleLogin() {
    if (email === MOCK_USER.email && password === MOCK_USER.password) {
      localStorage.setItem('user', JSON.stringify({ email }))
      navigate('/')
    } else {
      setError('Vale email või parool!')
    }
  }

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <h2>Login</h2>
        {error && <p className="login-error">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Logi sisse</button>
      </div>
    </div>
  )
}

export default LoginPage