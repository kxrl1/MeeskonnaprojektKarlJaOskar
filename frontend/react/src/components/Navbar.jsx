import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import '../styles/navbar.css';

export default function Navbar() {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">
        <span className="logo-text">Cine<span className="logo-accent">Rating</span></span>
      </Link>
      <ul className="nav-links">
        <li><Link to="/">Movies</Link></li>
        {user ? (
          <>
            <li><Link to="/watchlist" style={{color: 'rgba(237,240,255,0.8)', fontSize: '13px'}}>Watchlist</Link></li>
            <li><span style={{color: 'rgba(237,240,255,0.8)', fontSize: '13px'}}>Tere, {user.username}!</span></li>
            <li><button onClick={handleLogout} style={{background: 'transparent', border: '1px solid rgba(204,160,0,0.4)', color: 'var(--gold)', padding: '6px 14px', borderRadius: '4px', cursor: 'pointer', fontFamily: 'Montserrat', fontWeight: '600', fontSize: '12px'}}>Logi välja</button></li>
          </>
        ) : (
          <li><Link to="/login" className="nav-login">Login</Link></li>
        )}
      </ul>
    </nav>
  );
}