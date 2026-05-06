import {Link} from 'react-router-dom'
import '../styles/navbar.css'

function Navbar() {
  return (
    <nav className="navbar">
    <Link to="/" className="navbar-logo">CineRating</Link>
    <div className="navbar-links">
        <Link to="/">Movies</Link>
        <Link to="/login" className="navbar-link">Login</Link>
        <Link to="/register" className="navbar-link">Register</Link>
        </div>
    </nav>
  )
}

export default Navbar