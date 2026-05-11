import { Link } from 'react-router-dom';
import '../styles/navbar.css';

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">
        <span className="logo-text">Cine<span className="logo-accent">Rating</span></span>
      </Link>

      <ul className="nav-links">
        <li><Link to="/">Movies</Link></li>
        <li><Link to="/profile">Lists</Link></li>
        <li><Link to="/login" className="nav-login">Login</Link></li>
      </ul>
    </nav>
  );
}
