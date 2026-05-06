const axios = require('axios');
const { Movie, sequelize } = require('../models');
require('dotenv').config();

const TMDB_API_KEY = process.env.TMDB_API_KEY;

const fetchAndSeedMovies = async () => {
  try {
    await sequelize.authenticate();
    console.log('Andmebaas ühendatud!');

    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`
    );

    const movies = response.data.results;

    for (const m of movies) {
      await Movie.findOrCreate({
        where: { tmdbId: m.id },
        defaults: {
          title: m.title,
          description: m.overview,
          releaseYear: m.release_date ? parseInt(m.release_date.split('-')[0]) : null,
          posterUrl: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : null,
          genre: m.genre_ids.join(', '),
        }
      });
    }

    console.log(`${movies.length} filmi lisatud andmebaasi!`);
    process.exit(0);
  } catch (err) {
    console.error('Viga:', err.message);
    process.exit(1);
  }
};

fetchAndSeedMovies();