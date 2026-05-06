const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const WatchlistItem = sequelize.define('WatchlistItem', {
  watched: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = WatchlistItem;