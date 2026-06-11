import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/pages/profilePage.css';

export default function ProfilePage() {
  const [reviews, setReviews] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const navigate = useNavigate();
  const savedUser = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    if (!savedUser) {
      navigate('/login');
      return;
    }

    fetch(`http://localhost:3001/api/watchlist/${savedUser.id}`)
      .then(res => res.json())
      .then(data => setWatchlist(data));
  
    fetch(`http://localhost:3001/api/users/${savedUser.id}/reviews`)
      .then(res => res.json())
      .then(data => setReviews(data));
    }, []);

  if (!savedUser) return null;

  return (
    <div className="profile-page">

      {/* PROFIILI HERO */}
      <div className="profile-hero">
        <div className="profile-avatar">
          {savedUser.username.charAt(0).toUpperCase()}
        </div>
        <div className="profile-info">
          <h1 className="profile-username">{savedUser.username}</h1>
          <p className="profile-email">{savedUser.email}</p>
          <div className="profile-stats">
            <div className="profile-stat">
              <span className="stat-number">{watchlist.length}</span>
              <span className="stat-label">In Watchlist</span>
            </div>
            <div className="profile-stat">
              <span className="stat-number">{reviews.length}</span>
              <span className="stat-label">Reviews</span>
            </div>
          </div>
        </div>
      </div>

      {/* LINGID */}
      <div className="profile-links">
        <Link to="/watchlist" className="profile-link-btn">
          🎬 View watchlist
        </Link>
      </div>

    </div>
  );
}