# CineRating - Filmiarvustuste Platvorm

## Projekti Nimi ja Lühikirjeldus

**CineRating** on täispinu (full-stack) veebirakendus filmide avastamiseks, arvustamiseks ja hindamiseks. TMDB API-ga liidestatud platvorm võimaldab kasutajatel luua konto, hallata oma vaatamisnimekirja, kirjutada arvustusi ning filtreerida filme erinevate kriteeriumide alusel.

## Projekti Eesmärk

Luua kasutajasõbralik keskkond filmide uurimiseks ja arvustamiseks, võimaldades:
- Filmide kataloogile ligipääs väliste andmeallikatest (TMDB)
- Kasutajate turvalist autentimist ja isiklikke kogemusi
- Ühendkonnale arvustuste ja hinnangute jagamist
- Personaalse vaatamisnimekirja haldamist

## Kasutatud Tehnoloogiad

**Backend:**
- Node.js - JavaScript käimapalsu keskkond
- Express.js - veebiraamistik REST API jaoks
- Sequelize - ORM (Object-Relational Mapping)
- MySQL - relatsiooniline andmebaas
- Swagger - API dokumentatsioon
- Jest - testiraamistik

**Frontend:**
- React 18 - kasutajaliidese raamistik
- React Router - marsruutimine
- Vite - ehitusvahend ja arendusserver
- CSS3 - stilistimine

- **External APIs:**
- TMDB API (movie data)
- KinoCheck API (trailers)

## MVC Arhitektuuri Selgitus Projekti Kontekstis

Projekt järgib **MVC (Model-View-Controller)** arhitektuuri:

```
┌─────────────────────────────────────────────────┐
│ VIEW (Frontend - React)                          │
│ - Home.jsx, LoginPage.jsx, MoviePage.jsx        │
│ - MovieCard.jsx, Navbar.jsx komponendid         │
└────────────────┬────────────────────────────────┘
                 │ HTTP Requests/Responses
                 ▼
┌─────────────────────────────────────────────────┐
│ CONTROLLER (Backend - Express Routes)            │
│ - movieController.js                            │
│ - userController.js                             │
│ - reviewController.js                           │
│ - watchlistController.js                        │
└────────────────┬────────────────────────────────┘
                 │ Andmete manipuleerimine
                 ▼
┌─────────────────────────────────────────────────┐
│ MODEL (Sequelize ORM)                            │
│ - User, Movie, Review, WatchlistItem            │
│ - Andmebaasi skeem ja seosed                    │
└────────────────┬────────────────────────────────┘
                 │ SQL Päringud
                 ▼
         ┌──────────────┐
         │ MySQL Andmebaas│
         └──────────────┘
```

## ORM-i Kasutus ja Andmemudel

**ORM (Sequelize)** võimaldab andmebaasi tabelitega töötada JavaScripti objektidena. CineRating-is kasutamise näited:

### Andmemudel ja Seosed

```javascript
// Üks-mitmele seosed
User.hasMany(Review)        // Kasutajal palju arvustusi
Movie.hasMany(Review)       // Filmil palju arvustusi
User.hasMany(WatchlistItem) // Kasutajal palju vaatamisnimekirja kirjeid
Movie.hasMany(WatchlistItem)// Filmil palju vaatamisi

// Automaatne kaskaadiline kustutamine
{ onDelete: 'CASCADE' }
```

### Tabelid ja Väljad

**Users**
- id (Primary Key)
- username (UNIQUE)
- email (UNIQUE)
- passwordHash

**Movies**
- id (Primary Key)
- title
- tmdbId (UNIQUE, välise API identifikaator)
- releaseYear
- genre
- description
- posterUrl
- backdropUrl
- tmdbRating

**Reviews**
- id (Primary Key)
- userId (Foreign Key)
- movieId (Foreign Key)
- rating (1-5)
- content (tekst)
- UNIQUE(userId, movieId) - üks arvustus filmi kohta

**WatchlistItems**
- id (Primary Key)
- userId (Foreign Key)
- movieId (Foreign Key)

## Käivitusjuhend

### Eeltingimused
- Node.js (versioon 16+)
- MySQL andmebaasi server
- TMDB API võti (https://www.themoviedb.org/settings/api)

### Backend Käivitamine

1. Ava backend kaust:
```bash
cd backend
```

2. Paigalda sõltuvused:
```bash
npm install
```

3. Loo `.env` fail (vt `.env.example`):
```bash
cp .env.example .env
```

4. Täida `.env` oma andmetega:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sinu_parool
DB_NAME=cinerating
TMDB_API_KEY=sinu_tmdb_api_key
```

5. Täida andmebaas filmidega:
```bash
node src/config/seed.js
```

6. Käivita server:
```bash
npm start
```

Server jookseb aadressil: `http://localhost:3001`

### Frontend Käivitamine

1. Ava frontend kaust:
```bash
cd frontend/react
```

2. Paigalda sõltuvused:
```bash
npm install
```

3. Käivita arendusserver:
```bash
npm run dev
```

Rakendus avab aadressil: `http://localhost:5173`

## `.env.example` Selgitus

```
# Andmebaasi ühendus
DB_HOST=localhost              # MySQL serveri aadress
DB_USER=root                   # Andmebaasi kasutaja
DB_PASSWORD=qwerty             # Andmebaasi parool
DB_NAME=cinerating             # Andmebaasi nimi

# Väline API
TMDB_API_KEY=abc123def456      # The Movie Database API võti
                                # Hangi aadressilt: https://www.themoviedb.org/settings/api
```

## Andmemudeli Diagramm

```
┌─────────────────┐
│     Users       │
├─────────────────┤
│ id (PK)         │
│ username        │
│ email           │
│ passwordHash    │
└────────┬────────┘
         │ 1:N
         ├──────────────────┐
         │                  │
         ▼                  ▼
    ┌─────────────┐  ┌──────────────────┐
    │  Reviews    │  │ WatchlistItems   │
    ├─────────────┤  ├──────────────────┤
    │ id (PK)     │  │ id (PK)          │
    │ userId (FK) │  │ userId (FK)      │
    │ movieId(FK) │  │ movieId (FK)     │
    │ rating      │  └──────────────────┘
    │ content     │         ▲
    └────┬────────┘         │
         │                  │ 1:N
         │      ┌───────────┘
         │      │
         └─────►┌─────────────────┐
                │     Movies      │
                ├─────────────────┤
                │ id (PK)         │
                │ title           │
                │ tmdbId          │
                │ releaseYear     │
                │ genre           │
                │ posterUrl       │
                │ tmdbRating      │
                └─────────────────┘
```

## Swagger API Dokumentatsioon

API dokumentatsioon on saadaval aadressil:

**`http://localhost:3001/api-docs`**

Swagger UI-s näete kõiki API otspunkte, nende parameetreid ja näiteid.

### Peamised API Otspunktid

**Kasutajad:**
- `POST /api/users` - Registreerimine
- `GET /api/users/:id` - Kasutaja andmed

**Filmid:**
- `GET /api/movies` - Kõik filmid
- `GET /api/movies/:id` - Üks film
- `POST /api/movies` - Uus film

**Arvustused:**
- `GET /api/movies/:id/reviews` - Filmi arvustused
- `POST /api/movies/:id/reviews` - Lisa arvustus
- `DELETE /api/reviews/:id` - Kustuta arvustus

**Vaatamisnimekiri:**
- `GET /api/watchlist/:userId` - Kasutaja nimekiri
- `POST /api/watchlist` - Lisa film
- `DELETE /api/watchlist/:id` - Eemalda film

## Testide Käivitamise Juhend

### Unit ja Integratsioonitestid

Käivita testid käsuga:

```bash
cd backend
npm run test
```

### Testide Failid

- `backend/tests/api.integration.test.js` - API integratsioonitestid
- `backend/tests/review.unit.test.js` - Review mudeli unit testid

## Unit ja Integratsioonitestide Kirjeldus

### Unit Testid (`review.unit.test.js`)

Unit testid kontrollivad üksikute mudelite funktsionaalsust isoleeritult:

```javascript
// Näide: Review mudeli valideerimine
test('Review creatimine', async () => {
  const review = await Review.create({
    rating: 4,
    content: 'Hea film!',
    userId: 1,
    movieId: 1
  });
  expect(review.content).toBe('Hea film!');
});
```

**Testitavad aspektid:**
- Arvustuste loomine
- Valideerimine (üks arvustus filmi kohta)
- Andmete integriteet

### Integratsioonitestid (`api.integration.test.js`)

Integratsioonitestid kontrollivad terve API vooge otspunktite kaudu:

```javascript
// Näide: Registreerimine → Filmi loomine → Arvustus
test('POST /api/users - loo kasutaja', async () => {
  const res = await request(app).post('/api/users').send({
    username: 'testuser',
    email: 'test@test.com',
    passwordHash: '123456'
  });
  expect(res.status).toBe(201);
});
```

**Testitavad vooed:**
1. **Kasutaja voog**: Registreerimine → Andmete laadimine
2. **Arvustuse voog**: Filmi loomine → Arvustuse lisamine → Arvustuse lugemine
3. **Watchlist voog**: Lisa → Loe → Kustuta → Kontrolli

## Meeskonnaliikmed ja Tööjaotus

### Oskar
**Roll:** Backend arhitekt + arendaja + testija + dokumenteerija  
**Vastutused:** Projekti struktuur, Express API, Sequelize mudelid, Swagger dokumentatsioon

### Karl
**Roll:** Frontend arendaja + arendaja + testija + dokumenteerija  
**Vastutused:** React SPA, integratsioonitestid, unit testid, README

## Projekti Struktuur

```
backend/
├── src/
│   ├── app.js
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── config/
├── tests/
└── package.json

frontend/react/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── styles/
└── package.json
```

## Valideerimisreeglid

**Kasutaja Registreerimine:**
- Username: minimaalselt 3 tähemärki, ainult tähed ja numbrid
- Email: peab sisaldama `@` ja `.`
- Parool: minimaalselt 8 tähemärki

## Litsents

ISC
