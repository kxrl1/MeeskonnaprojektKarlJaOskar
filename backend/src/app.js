const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const userRoutes = require('./routes/userRoutes');
const movieRoutes = require('./routes/movieRoutes');
const reviewRoutes = require('./controllers/reviewRoutes');
const watchlistRoutes = require('./controllers/watchlistRoutes');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/movies/:movieId/reviews', reviewRoutes);
app.use('/api/watchlist', watchlistRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'CineRating API töötab!' });
});

sequelize.sync({ alter: true })
  .then(() => console.log('Andmebaas sünkroniseeritud!'))
  .catch((err) => console.error('Andmebaasi viga:', err));

module.exports = app;