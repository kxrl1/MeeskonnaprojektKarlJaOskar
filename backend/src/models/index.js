const sequelize = require('../config/database');
const User = require('./User');
const Movie = require('./Movie');
const Review = require('./Review');
const WatchlistItem = require('./WatchlistItem');

// User -> Review (üks-mitmele)
User.hasMany(Review, { foreignKey: 'userId', onDelete: 'CASCADE' });
Review.belongsTo(User, { foreignKey: 'userId' });

// Movie -> Review (üks-mitmele)
Movie.hasMany(Review, { foreignKey: 'movieId', onDelete: 'CASCADE' });
Review.belongsTo(Movie, { foreignKey: 'movieId' });

// User -> WatchlistItem (üks-mitmele)
User.hasMany(WatchlistItem, { foreignKey: 'userId', onDelete: 'CASCADE' });
WatchlistItem.belongsTo(User, { foreignKey: 'userId' });

// Movie -> WatchlistItem (üks-mitmele)
Movie.hasMany(WatchlistItem, { foreignKey: 'movieId', onDelete: 'CASCADE' });
WatchlistItem.belongsTo(Movie, { foreignKey: 'movieId' });

module.exports = { sequelize, User, Movie, Review, WatchlistItem };