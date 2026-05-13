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
    console.log('Movie ID:', id);
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
    setMessage('Palun vali hinnang ja kirjuta arvustus!');
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
    setMessage('Arvustus lisatud!');
  } else {
    setMessage(data.error);
  }
};

  if (!movie) return <div className="movie-loading">Laen...</div>;

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 'Pole hinnanguid';

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
            <h1 className="movie-title">{movie.title}</h1>
            <div className="movie-meta">
              {movie.releaseYear && <span>{movie.releaseYear}</span>}
              {movie.genre && <span>{movie.genre}</span>}
            </div>
            <div className="movie-avg-rating">
              ⭐ {avgRating} · {reviews.length} arvustust
            </div>
            <p className="movie-description">{movie.description}</p>
          </div>
        </div>
      </div>

      {/* ARVUSTUSE VORM */}
      <div className="movie-review-section">
        <h2>Lisa arvustus</h2>
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
          placeholder="Kirjuta arvustus..."
          value={content}
          onChange={e => setContent(e.target.value)}
        />
        <button className="review-submit-btn" onClick={submitReview}>
          Postita arvustus
        </button>
        {message && <p className="review-message">{message}</p>}
      </div>

      {/* ARVUSTUSED */}
      <div className="movie-reviews">
        <h2>Arvustused ({reviews.length})</h2>
        {reviews.length === 0 && <p className="no-reviews">Pole veel arvustusi.</p>}
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