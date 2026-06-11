import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const isValidUsername = (u) => u.length >= 3 && /^[a-zA-Z0-9]+$/.test(u);
  const isValidEmail = (e) => e.includes('@') && e.includes('.');
  const isValidPassword = (p) => p.length >= 8;

  async function handleRegister() {
    if (!username || !email || !password) {
      setError('All fields are required!');
      return;
    }

    if (!isValidUsername(username)) {
      setError('Username must be at least 3 characters, letters and numbers only!');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Email must contain @ and .!');
      return;
    }

    if (!isValidPassword(password)) {
      setError('Password must be at least 8 characters!');
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
        setError(data.error || 'Registration failed!');
      }
    } catch (err) {
      setError('Server error!');
    }
  }

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <h2>Register</h2>
        {error && <p className="login-error">{error}</p>}
        <input
          type="text"
          placeholder="Username"
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
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div style={{ fontSize: '12px', color: '#666', marginTop: '10px', textAlign: 'left' }}>
          <p style={{ marginBottom: '5px', fontWeight: 'bold' }}>Requirements:</p>
          <ul style={{ marginLeft: '20px', marginTop: '5px' }}>
            <li>Username minimum 3 characters, letters and numbers only</li>
            <li>Email must contain `@` and `.`</li>
            <li>Password minimum 8 characters</li>
          </ul>
        </div>
        <button onClick={handleRegister}>Register</button>
        <p className="login-register-link">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;