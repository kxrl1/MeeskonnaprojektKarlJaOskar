const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Movie = sequelize.define('Movie', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  director: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  releaseYear: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  genre: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  posterUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  backdropUrl: {
  type: DataTypes.STRING,
  allowNull: true,
  },
  tmdbId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  },
  tmdbRating: {
  type: DataTypes.FLOAT,
  allowNull: true,
  },
});

module.exports = Movie;