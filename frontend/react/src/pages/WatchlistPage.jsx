import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import '../styles/pages/watchlistPage.css';

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState([]);
  const [movies, setMovies] = useState([]);
  const savedUser = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    if (!savedUser) return;
    fetch(`http://localhost:3001/api/watchlist/${savedUser.id}`)
      .then(res => res.json())
      .then(async (items) => {
        setWatchlist(items);
        const movieData = await Promise.all(
          items.map(item =>
            fetch(`http://localhost:3001/api/movies/${item.movieId}`)
              .then(res => res.json())
          )
        );
        setMovies(movieData);
      });
  }, []);

  const removeFromWatchlist = async (itemId) => {
    const res = await fetch(`http://localhost:3001/api/watchlist/${itemId}`, {
      method: 'DELETE'
    });
    if (res.ok) {
      setWatchlist(prev => prev.filter(i => i.id !== itemId));
      setMovies(prev => prev.filter((_, index) => watchlist[index].id !== itemId));
    }
  };

  if (!savedUser) return (
    <div className="watchlist-not-logged">
      <h2>Pead olema sisse logitud!</h2>
      <Link to="/login">Logi sisse</Link>
    </div>
  );

  return (
    <div className="watchlist-page">
      <h1 className="watchlist-title">Minu Watchlist ({movies.length})</h1>
      {movies.length === 0 ? (
        <p className="watchlist-empty">Watchlist on tühi. Lisa filme!</p>
      ) : (
        <div className="watchlist-grid">
          {movies.map((movie, index) => (
            <div key={movie.id} className="watchlist-card-wrap">
              <MovieCard movie={movie} />
              <button
                className="watchlist-remove-btn"
                onClick={() => removeFromWatchlist(watchlist[index].id)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}