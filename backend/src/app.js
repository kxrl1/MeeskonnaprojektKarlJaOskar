const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const userRoutes = require('./routes/userRoutes');
const movieRoutes = require('./routes/movieRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const watchlistRoutes = require('./routes/watchlistRoutes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger.js');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/movies/:movieId/reviews', reviewRoutes);
app.use('/api/watchlist', watchlistRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => {
  res.json({ message: 'CineRating API töötab!' });
});

if (process.env.NODE_ENV !== 'test') {
  sequelize.sync({ alter: true })
    .then(() => console.log('Andmebaas sünkroniseeritud!'))
    .catch((err) => console.error('Andmebaasi viga:', err));
}

module.exports = app;