// ÜL 3.6 Osa C: CineRating mudelite ühiktestid
// Fail läheb kausta: backend/tests/models.unit.test.js
//
// Erinevalt sõbra review.unit.test.js-ist testib see fail PÄRIS mudeleid
// (src/models). Andmebaasi asendame mälusisese SQLite'iga, nii et MySQL-i pole vaja.

jest.mock('../src/config/database', () => {
  const { Sequelize } = require('sequelize');
  return new Sequelize('sqlite::memory:', { logging: false });
});

const { sequelize, User, Movie, Review } = require('../src/models');

let user;
let movie;

beforeEach(async () => {
  await sequelize.sync({ force: true }); // iga test alustab tühja andmebaasiga
  user = await User.create({
    username: 'testuser',
    email: 'test@test.com',
    passwordHash: 'parool123',
  });
  movie = await Movie.create({ title: 'Test Film', tmdbId: 1001 });
});

afterAll(async () => {
  await sequelize.close();
});

// ---------- POSITIIVSED TESTID ----------

test('1. positiivne: arvustus luuakse õigete andmetega', async () => {
  const review = await Review.create({
    rating: 4,
    content: 'Hea film!',
    userId: user.id,
    movieId: movie.id,
  });
  expect(review.id).toBeDefined();
  expect(review.rating).toBe(4);
  expect(review.content).toBe('Hea film!');
});

test('2. positiivne: kasutaja luuakse õigete andmetega', async () => {
  const newUser = await User.create({
    username: 'uuskasutaja',
    email: 'uus@test.com',
    passwordHash: 'parool123',
  });
  expect(newUser.id).toBeDefined();
  expect(newUser.email).toBe('uus@test.com');
});

// ---------- NEGATIIVSED TESTID ----------

test('3. negatiivne: hinnang 0 annab vea', async () => {
  await expect(
    Review.create({ rating: 0, content: 'Halb', userId: user.id, movieId: movie.id })
  ).rejects.toThrow();
});

test('4. negatiivne: sama e-posti kasutamine teist korda annab vea', async () => {
  await expect(
    User.create({ username: 'teine', email: 'test@test.com', passwordHash: 'parool123' })
  ).rejects.toThrow();
});

test('5. negatiivne: arvustus ilma tekstita annab vea', async () => {
  await expect(
    Review.create({ rating: 3, userId: user.id, movieId: movie.id })
  ).rejects.toThrow();
});

// ---------- ÄÄREJUHTUMID ----------

test('6. äärejuhtum: hinnangud 1 ja 5 on lubatud (piirväärtused)', async () => {
  const low = await Review.create({ rating: 1, content: 'Nõrk', userId: user.id, movieId: movie.id });
  const otherMovie = await Movie.create({ title: 'Teine Film', tmdbId: 1002 });
  const high = await Review.create({ rating: 5, content: 'Suurepärane', userId: user.id, movieId: otherMovie.id });
  expect(low.rating).toBe(1);
  expect(high.rating).toBe(5);
});

test('7. äärejuhtum: hinnang 6 (kohe üle piiri) annab vea', async () => {
  await expect(
    Review.create({ rating: 6, content: 'Liiga hea', userId: user.id, movieId: movie.id })
  ).rejects.toThrow();
});

// ---------- VIGASE SISENDI TEST ----------

test('8. vigane sisend: hinnang puudub (null) annab vea', async () => {
  await expect(
    Review.create({ rating: null, content: 'Hinnang puudub', userId: user.id, movieId: movie.id })
  ).rejects.toThrow();
});

// ---------- VEAOTSINGU TESTID (README reeglite kontroll) ----------
// Need testid kontrollivad reegleid, mida README lubab. Kui test KUKUB,
// on see kandidaat veaks Osa D jaoks.

test('9. README: sama kasutaja ei saa sama filmi kahte korda arvustada (UNIQUE)', async () => {
  await Review.create({ rating: 4, content: 'Esimene', userId: user.id, movieId: movie.id });
  await expect(
    Review.create({ rating: 2, content: 'Teine', userId: user.id, movieId: movie.id })
  ).rejects.toThrow();
});

test('10. README: kasutajanimi alla 3 tähemärgi annab vea', async () => {
  await expect(
    User.create({ username: 'ab', email: 'ab@test.com', passwordHash: 'parool123' })
  ).rejects.toThrow();
});