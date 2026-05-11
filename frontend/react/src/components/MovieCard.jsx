import { Link } from 'react-router-dom';
import '../styles/movieCard.css';

export default function MovieCard({ movie }) {
  const { id, title, vote_average, release_date, genre, poster_path } = movie;

  return (
    <Link to={`/movie/${id}`} className="movie-card">
      <div className="movie-poster">
        {poster_path ? (
          <img
            src={`https://image.tmdb.org/t/p/w300${poster_path}`}
            alt={title}
          />
        ) : (
          <div className="movie-poster-placeholder">
            <svg viewBox="0 0 24 24">
              <path d="M18 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm-9 13V7l7 5-7 5z"/>
            </svg>
          </div>
        )}
      </div>
      <div className="movie-info">
        <div className="movie-title">{title || 'MOVIE'}</div>
        {genre && <div className="movie-genre">{genre} · {release_date?.slice(0, 4)}</div>}
        <div className="movie-rating">
          <svg viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          {vote_average ? vote_average.toFixed(1) : 'Rating'}
        </div>
      </div>
    </Link>
  );
}