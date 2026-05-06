const { Sequelize } = require('sequelize');
const { DataTypes } = require('sequelize');

// Loome testimiseks eraldi in-memory andmebaasi
const sequelize = new Sequelize('sqlite::memory:', { logging: false });

const Review = sequelize.define('Review', {
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1, max: 5 }
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  userId: DataTypes.INTEGER,
  movieId: DataTypes.INTEGER,
});

beforeAll(async () => {
  await sequelize.sync();
});

afterAll(async () => {
  await sequelize.close();
});

test('arvustus luuakse õigete andmetega', async () => {
  const review = await Review.create({ rating: 4, content: 'Hea film!', userId: 1, movieId: 1 });
  expect(review.rating).toBe(4);
  expect(review.content).toBe('Hea film!');
});

test('hinnang alla 1 annab vea', async () => {
  await expect(
    Review.create({ rating: 0, content: 'Halb', userId: 1, movieId: 2 })
  ).rejects.toThrow();
});

test('hinnang üle 5 annab vea', async () => {
  await expect(
    Review.create({ rating: 6, content: 'Liiga hea', userId: 1, movieId: 3 })
  ).rejects.toThrow();
});