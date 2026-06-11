import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/pages/moviePage.css';

export default function MoviePage() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch(`http://localhost:3001/api/movies/${id}`)
      .then(res => res.json())
      .then(data => setMovie(data));

    fetch(`http://localhost:3001/api/movies/${id}/reviews`)
      .then(res => res.json())
      .then(data => setReviews(data));
  }, [id]);

const savedUser = JSON.parse(localStorage.getItem('user') || 'null');

const submitReview = async () => {
  if (!savedUser) {
    setMessage('Pead olema sisse logitud!');
    return;
  }
  if (!rating || !content) {
    setMessage('Please select a rating and write a review!');
    return;
  }
  const res = await fetch(`http://localhost:3001/api/movies/${id}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: savedUser.id, rating, content })
  });
  const data = await res.json();
  if (res.ok) {
    setReviews([...reviews, data]);
    setRating(0);
    setContent('');
    setMessage('Review added!');
  } else {
    setMessage(data.error);
  }
};

const addToWatchlist = async () => {
  const savedUser = JSON.parse(localStorage.getItem('user') || 'null');
  if (!savedUser) {
    setMessage('You must be logged in!');
    return;
  }
  const res = await fetch('http://localhost:3001/api/watchlist', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: savedUser.id, movieId: parseInt(id) })
  });
  const data = await res.json();
  console.log('Watchlist viga:', data);
  if (res.ok) {
    setMessage('movie added to watchlist');
  } else {
    setMessage(data.error);
  }
};

const removeFromWatchlist = async (itemId) => {
  const res = await fetch(`http://localhost:3001/api/watchlist/${itemId}`, {
    method: 'DELETE'
  });
  if (res.ok) {
    setWatchlist(prev => prev.filter(i => i.id !== itemId));
    setMovies(prev => prev.filter((_, index) => watchlist[index].id !== itemId));
  }
};

  if (!movie) return <div className="movie-loading">Loading...</div>;

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 'No ratings';

  return (
    <div className="movie-page">

      {/* HERO */}
      <div className="movie-hero" style={{
        backgroundImage: `url(${movie.backdropUrl || movie.posterUrl})`
      }}>
        <div className="movie-hero-overlay" />
        <div className="movie-hero-content">
          <img src={movie.posterUrl} alt={movie.title} className="movie-poster" />
          <div className="movie-info">
            <button className="watchlist-btn" onClick={addToWatchlist}>
              + Add to watchlist
            </button>
            {message && <p className='review-message'>{message}</p>}
            <h1 className="movie-title">{movie.title}</h1>
            <div className="movie-meta">
              {movie.releaseYear && <span>{movie.releaseYear}</span>}
              {movie.genre && <span>{movie.genre}</span>}
            </div>
            <div className="movie-avg-rating">
              ⭐ {avgRating} · {reviews.length} reviews
              {movie.tmdbRating && (
                <span style={{fontSize: '14px', color: 'rgba(150,160,180,0.7)', marginLeft: '12px'}}>
                  TMDB: {(movie.tmdbRating / 2).toFixed(1)}
                </span>
              )}
            </div>
            <p className="movie-description">{movie.description}</p>
          </div>
        </div>
      </div>

      {/* ARVUSTUSE VORM */}
      <div className="movie-review-section">
        <h2>"Add a review</h2>
        <div className="star-picker">
          {[1,2,3,4,5].map(s => (
            <span
              key={s}
              className={`star ${s <= rating ? 'active' : ''}`}
              onClick={() => setRating(s)}
            >★</span>
          ))}
        </div>
        <textarea
          className="review-input"
          placeholder="Write a review..."
          value={content}
          onChange={e => setContent(e.target.value)}
        />
        <button className="review-submit-btn" onClick={submitReview}>
          Post review
        </button>
        {message && <p className="review-message">{message}</p>}
      </div>

      {/* ARVUSTUSED */}
      <div className="movie-reviews">
        <h2>Reviews ({reviews.length})</h2>
        {reviews.length === 0 && <p className="no-reviews">No reviews yet.</p>}
        {reviews.map(r => (
          <div key={r.id} className="review-card">
            <div className="review-header">
              <span className="review-rating">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
            </div>
            <p className="review-content">{r.content}</p>
          </div>
        ))}
      </div>

    </div>
  );
}