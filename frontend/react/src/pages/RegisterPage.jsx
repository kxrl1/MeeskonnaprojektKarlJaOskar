import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleRegister() {
    if (!username || !email || !password) {
      setError('Kõik väljad on kohustuslikud!');
      return;
    }
    try {
      const res = await fetch('http://localhost:3001/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, passwordHash: password })
      });
      const data = await res.json();
      if (res.ok) {
        navigate('/login');
      } else {
        setError(data.error || 'Registreerimine ebaõnnestus!');
      }
    } catch (err) {
      setError('Serveri viga!');
    }
  }

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <h2>Registreeru</h2>
        {error && <p className="login-error">{error}</p>}
        <input
          type="text"
          placeholder="Kasutajanimi"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Parool"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleRegister}>Registreeru</button>
        <p className="login-register-link">
          On juba konto? <Link to="/login">Logi sisse</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;