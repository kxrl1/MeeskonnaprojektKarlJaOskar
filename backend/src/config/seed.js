const axios = require('axios');
const { Movie, sequelize } = require('../models');
require('dotenv').config();

const TMDB_API_KEY = process.env.TMDB_API_KEY;

const GENRES = {
  28: 'Action', 12: 'Adventure', 16: 'Animation',
  35: 'Comedy', 80: 'Crime', 99: 'Documentary',
  18: 'Drama', 10751: 'Family', 14: 'Fantasy',
  36: 'History', 27: 'Horror', 10402: 'Music',
  9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi',
  10770: 'TV Movie', 53: 'Thriller', 10752: 'War',
  37: 'Western'
};

const fetchAndSeedMovies = async () => {
  try {
    await sequelize.authenticate();
    console.log('Andmebaas ühendatud!');

    const pages = [1, 2, 3, 4, 5];
    let allMovies = [];

    for (const page of pages) {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`
      );
      allMovies = [...allMovies, ...response.data.results];
    }

    for (const m of allMovies) {
      await Movie.upsert({
        tmdbId: m.id,
        title: m.title,
        description: m.overview,
        releaseYear: m.release_date ? parseInt(m.release_date.split('-')[0]) : null,
        posterUrl: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : null,
        backdropUrl: m.backdrop_path ? `https://image.tmdb.org/t/p/original${m.backdrop_path}` : null,
        genre: m.genre_ids.map(id => GENRES[id] || id).join(', '),
      });
    }

    console.log(`${allMovies.length} filmi lisatud andmebaasi!`);
    process.exit(0);
  } catch (err) {
    console.error('Viga:', err.message);
    process.exit(1);
  }
};

fetchAndSeedMovies();