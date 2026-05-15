import { useState, useEffect, useRef } from 'react';
import MovieCard from '../components/MovieCard';
import '../styles/pages/home.css';
import { Link } from 'react-router-dom';

function SliderSlide({ slide, onHover = () => {}, muted, setMuted }) {
  const [trailerId, setTrailerId] = useState(null);
  const [hovered, setHovered] = useState(false);
  const iframeRef = useRef(null);

  const loadTrailer = async () => {
    if (trailerId) return;
    try {
      const res = await fetch(
        `https://api.kinocheck.com/movies?tmdb_id=${slide.tmdbId}&categories=Trailer&language=en`
      );
      const data = await res.json();
      if (data.trailer?.youtube_video_id) {
        setTrailerId(data.trailer.youtube_video_id);
      }
    } catch (err) {
      console.error('Trailer viga:', err);
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    const newMuted = !muted;
    setMuted(newMuted);
    if (iframeRef.current) {
      iframeRef.current.contentWindow.postMessage(
      JSON.stringify({ event: 'command', func: newMuted ? 'mute' : 'unMute' }),
      '*'
    );
  }
};

  return (
    <div
      className="slide"
      onMouseEnter={() => { setHovered(true); loadTrailer(); onHover(true); }}
      onMouseLeave={() => { setHovered(false); onHover(false); }}
    >
      {!(hovered && trailerId) && (
        <img
          src={slide.backdropUrl || slide.posterUrl}
          alt={slide.title}
          className="slide-img"
        />
      )}
      {hovered && trailerId && (
        <>
          <iframe
          ref={iframeRef}
          src={`https://www.youtube.com/embed/${trailerId}?autoplay=1&mute=1&controls=0&modestbranding=1&enablejsapi=1`}
          className="slide-iframe"
          allow="autoplay"
          title={slide.title}
          onLoad={() => {
            if (!muted && iframeRef.current) {
              setTimeout(() => {
                iframeRef.current?.contentWindow.postMessage(
                  JSON.stringify({ event: 'command', func: 'unMute' }),
                  '*'
                  );
                }, 500);
              }
            }}
          />
          <button className="slide-mute-btn" onClick={toggleMute}>
            {muted ? '🔇' : '🔊'}
          </button>
        </>
      )}
      <div className="slide-overlay" />
      <div className="slide-label">{slide.title}</div>
      <Link to={`/movie/${slide.id}`} className="slide-more-btn">
        Vaata lähemalt →
      </Link>
    </div>
  );
}

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
        <button className="nf-btn nf-btn--left" onClick={() => scroll(-1)}>
          <svg viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
        <div className="nf-track" ref={rowRef}>
          {movies.map(movie => (
            <Link to={`/movie/${movie.id}`} key={movie.id} className="nf-card" style={{textDecoration: 'none'}}>
              <div className="nf-card-poster">
                {movie.posterUrl ? (
                  <img src={movie.posterUrl} alt={movie.title} />
                ) : (
                  <div className="nf-card-placeholder">
                    <span>MOVIE</span>
                  </div>
                )}
                <div className="nf-card-hover">
                  <div className="nf-card-title">{movie.title}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <button className="nf-btn nf-btn--right" onClick={() => scroll(1)}>
          <svg viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [current, setCurrent] = useState(0);
  const [search, setSearch] = useState('');
  const [muted, setMuted] = useState(true);
  const intervalRef = useRef(null);

  useEffect(() => {
    fetch('http://localhost:3001/api/movies')
      .then(res => res.json())
      .then(data => setMovies(data))
      .catch(err => console.error('Viga filmide laadimisel:', err));
  }, []);

  const sliderMovies = movies.slice(0, 5);

  useEffect(() => {
    if (sliderMovies.length === 0) return;
    intervalRef.current = setInterval(() => {
      setCurrent(prev => (prev + 1) % sliderMovies.length);
    }, 10000);
    return () => clearInterval(intervalRef.current);
  }, [sliderMovies.length]);

  const goTo = (index) => {
    setCurrent(index);
    clearInterval(intervalRef.current);
  intervalRef.current = setInterval(() => {
    setCurrent(prev => (prev + 1) % sliderMovies.length);
  }, 10000);
  };

  const filteredMovies = movies.filter(m =>
    m.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="home">

{/* HERO SLIDER */}
<section className="slider">
  <div
    className="slider-track"
    style={{ transform: `translateX(-${current * 100}%)` }}
  >
    {sliderMovies.map((slide) => (
      <SliderSlide key={slide.id} slide={slide} muted={muted} setMuted={setMuted} onHover={(h) => {
        if (h) clearInterval(intervalRef.current);
        else {
          intervalRef.current = setInterval(() => {
            setCurrent(prev => (prev + 1) % sliderMovies.length);
          }, 10000);
        }
      }} />
    ))}
  </div>

  <button className="slider-btn slider-btn--prev" onClick={() => goTo((current - 1 + sliderMovies.length) % sliderMovies.length)}>
    <svg viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6"/>
    </svg>
  </button>
  <button className="slider-btn slider-btn--next" onClick={() => goTo((current + 1) % sliderMovies.length)}>
    <svg viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l6-6-6-6"/>
    </svg>
  </button>

  <div className="slider-dots">
    {sliderMovies.map((_, i) => (
      <button
        key={i}
        className={`slider-dot${i === current ? ' active' : ''}`}
        onClick={() => goTo(i)}
      />
    ))}
  </div>
</section>

      {/* NETFLIX ROW */}
      <NetflixRow title="Popular Movies" movies={movies} />

      {/* ABOUT */}
      <section className="about-section">
        <div className="about-box">
          <p>
            Movies are magic. They transport us to alien worlds, ancient times, and entirely new
            perspectives, all from the comfort of a dark theater or our living room couch.
          </p>
        </div>
      </section>

      {/* SEARCH */}
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

      {/* MOVIE GRID */}
      <section className="grid-section">
        <div className="movies-grid">
          {filteredMovies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>

    </main>
  );
}