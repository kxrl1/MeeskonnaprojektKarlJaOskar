const request = require('supertest');
const app = require('../src/app');
const { sequelize } = require('../src/models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

// Voog 1: POST kasutaja → GET kasutaja
describe('Kasutaja voog', () => {
  let userId;

  test('POST /api/users - loo kasutaja', async () => {
    const res = await request(app).post('/api/users').send({
      username: 'testuser',
      email: 'test@test.com',
      passwordHash: '123456'
    });
    expect(res.status).toBe(201);
    expect(res.body.username).toBe('testuser');
    userId = res.body.id;
  });

  test('GET /api/users/:id - leia kasutaja', async () => {
    const res = await request(app).get(`/api/users/${userId}`);
    expect(res.status).toBe(200);
    expect(res.body.email).toBe('test@test.com');
  });
});

// Voog 2: POST film → POST arvustus → GET arvustused
describe('Arvustuse voog', () => {
  let movieId;
  let reviewId;

  test('POST /api/movies - loo film', async () => {
    const res = await request(app).post('/api/movies').send({
      title: 'Test Film',
      tmdbId: 99999,
      releaseYear: 2024
    });
    expect(res.status).toBe(201);
    movieId = res.body.id;
  });

  test('POST /api/movies/:id/reviews - lisa arvustus', async () => {
    const res = await request(app)
      .post(`/api/movies/${movieId}/reviews`)
      .send({ userId: 1, rating: 4, content: 'Väga hea film!' });
    expect(res.status).toBe(201);
    reviewId = res.body.id;
  });

  test('GET /api/movies/:id/reviews - loe arvustused', async () => {
    const res = await request(app).get(`/api/movies/${movieId}/reviews`);
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
  });
});

// Voog 3: POST watchlist → GET → DELETE → GET
describe('Watchlist voog', () => {
  let itemId;

  test('POST /api/watchlist - lisa nimekirja', async () => {
    const res = await request(app).post('/api/watchlist').send({
      userId: 1,
      movieId: 1
    });
    expect(res.status).toBe(201);
    itemId = res.body.id;
  });

  test('GET /api/watchlist/:userId - loe nimekiri', async () => {
    const res = await request(app).get('/api/watchlist/1');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
  });

  test('DELETE /api/watchlist/:id - eemalda nimekirjast', async () => {
    const res = await request(app).delete(`/api/watchlist/${itemId}`);
    expect(res.status).toBe(200);
  });

  test('GET /api/watchlist/:userId - nimekiri on tühi', async () => {
    const res = await request(app).get('/api/watchlist/1');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(0);
  });
});