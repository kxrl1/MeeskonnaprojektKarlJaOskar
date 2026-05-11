import { useState, useEffect, useRef } from 'react';
import MovieCard from '../components/MovieCard';
import '../styles/pages/home.css';

const PLACEHOLDER_MOVIES = [
  { id: 1, title: 'MOVIE', vote_average: null, release_date: '2024', genre: null, poster_path: null },
  { id: 2, title: 'MOVIE', vote_average: null, release_date: '2024', genre: null, poster_path: null },
  { id: 3, title: 'MOVIE', vote_average: null, release_date: '2024', genre: null, poster_path: null },
  { id: 4, title: 'MOVIE', vote_average: null, release_date: '2024', genre: null, poster_path: null },
  { id: 5, title: 'MOVIE', vote_average: null, release_date: '2024', genre: null, poster_path: null },
  { id: 6, title: 'MOVIE', vote_average: null, release_date: '2024', genre: null, poster_path: null },
];

const SLIDER_SLIDES = [
  { id: 1, title: 'MOVIE', poster_path: null },
  { id: 2, title: 'MOVIE', poster_path: null },
  { id: 3, title: 'MOVIE', poster_path: null },
  { id: 4, title: 'MOVIE', poster_path: null },
  { id: 5, title: 'MOVIE', poster_path: null },
];

// Netflix row data — asenda TMDB andmetega
const ROW_MOVIES = [
  { id: 101, title: 'MOVIE', vote_average: null, poster_path: null },
  { id: 102, title: 'MOVIE', vote_average: null, poster_path: null },
  { id: 103, title: 'MOVIE', vote_average: null, poster_path: null },
  { id: 104, title: 'MOVIE', vote_average: null, poster_path: null },
  { id: 105, title: 'MOVIE', vote_average: null, poster_path: null },
  { id: 106, title: 'MOVIE', vote_average: null, poster_path: null },
  { id: 107, title: 'MOVIE', vote_average: null, poster_path: null },
  { id: 108, title: 'MOVIE', vote_average: null, poster_path: null },
];

// ── Netflix-style horizontal row ──
function NetflixRow({ title, movies }) {
  const rowRef = useRef(null);

  const scroll = (dir) => {
    if (!rowRef.current) return;
    rowRef.current.scrollBy({ left: dir * 600, behavior: 'smooth' });
  };

  return (
    <div className="nf-row">
      <h2 className="nf-row-title">{title}</h2>
      <div className="nf-row-wrap">

        <button className="nf-btn nf-btn--left" onClick={() => scroll(-1)} aria-label="Scroll left">
          <svg viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>

        <div className="nf-track" ref={rowRef}>
          {movies.map(movie => (
            <div key={movie.id} className="nf-card">
              <div className="nf-card-poster">
                {movie.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                    alt={movie.title}
                  />
                ) : (
                  <div className="nf-card-placeholder">
                    <svg viewBox="0 0 24 24">
                      <path d="M18 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm-9 13V7l7 5-7 5z"/>
                    </svg>
                    <span>MOVIE</span>
                  </div>
                )}
                <div className="nf-card-hover">
                  <div className="nf-card-title">{movie.title}</div>
                  {movie.vote_average && (
                    <div className="nf-card-rating">
                      <svg viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                      {movie.vote_average.toFixed(1)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <button className="nf-btn nf-btn--right" onClick={() => scroll(1)} aria-label="Scroll right">
          <svg viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>

      </div>
    </div>
  );
}

// ── Main page ──
export default function Home() {
  const movies = PLACEHOLDER_MOVIES;
  const [current, setCurrent] = useState(0);
  const [search, setSearch] = useState('');
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrent(prev => (prev + 1) % SLIDER_SLIDES.length);
    }, 3500);
    return () => clearInterval(intervalRef.current);
  }, []);

  const goTo = (index) => {
    setCurrent(index);
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrent(prev => (prev + 1) % SLIDER_SLIDES.length);
    }, 3500);
  };

  const prev = () => goTo((current - 1 + SLIDER_SLIDES.length) % SLIDER_SLIDES.length);
  const next = () => goTo((current + 1) % SLIDER_SLIDES.length);

  return (
    <main className="home">

      {/* ── HERO SLIDER ── */}
      <section className="slider">
        <div
          className="slider-track"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {SLIDER_SLIDES.map((slide) => (
            <div key={slide.id} className="slide">
              {slide.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/original${slide.poster_path}`}
                  alt={slide.title}
                  className="slide-img"
                />
              ) : (
                <div className="slide-placeholder">
                  <svg viewBox="0 0 24 24">
                    <path d="M18 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm-9 13V7l7 5-7 5z"/>
                  </svg>
                  <span>MOVIE</span>
                </div>
              )}
              <div className="slide-overlay" />
              <div className="slide-label">{slide.title}</div>
            </div>
          ))}
        </div>

        <button className="slider-btn slider-btn--prev" onClick={prev} aria-label="Previous">
          <svg viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
        <button className="slider-btn slider-btn--next" onClick={next} aria-label="Next">
          <svg viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>

        <div className="slider-dots">
          {SLIDER_SLIDES.map((_, i) => (
            <button
              key={i}
              className={`slider-dot${i === current ? ' active' : ''}`}
              onClick={() => goTo(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* ── NETFLIX-STYLE CARD ROW ── */}
      <NetflixRow title="Popular Movies" movies={ROW_MOVIES} />

      {/* ── ABOUT ── */}
      <section className="about-section">
        <div className="about-box">
          <p>
            Movies are magic. They transport us to alien worlds, ancient times, and entirely new
            perspectives, all from the comfort of a dark theater or our living room couch. A great
            film is a symphony of moving parts: lighting, acting, writing, directing, and sound
            design coming together to create an illusion of reality. Whether it is a blockbuster
            explosion, a quiet indie drama, or a terrifying horror flick, cinema connects us through
            shared emotion. It is a universal language that transcends borders. For over a century,
            the silver screen has reflected our deepest fears, grandest dreams, and the shared
            human condition.
          </p>
        </div>
      </section>

      {/* ── SEARCH + FILTER ── */}
      <section className="search-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="search-input"
          />
          <button className="search-btn">Filter</button>
        </div>
      </section>

      {/* ── MOVIE GRID ── */}
      <section className="grid-section">
        <div className="movies-grid">
          {movies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>

    </main>
  );
}