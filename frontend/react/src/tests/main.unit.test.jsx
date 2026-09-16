import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

// 1. Ärilogika abifunktsioonid
function validateUsername(username) {
  return typeof username === 'string' && username.length >= 3 && /^[a-zA-Z0-9]+$/.test(username);
}

function validateEmail(email) {
  return typeof email === 'string' && email.includes('@') && email.includes('.');
}

function validateRating(rating) {
  return Number.isInteger(rating) && rating >= 1 && rating <= 5;
}

function canUserReviewMovie(existingReviews, userId, movieId) {
  return !existingReviews.some(r => r.userId === userId && r.movieId === movieId);
}

// 2. React (JSX) komponendid
function MovieBadge({ title, rating }) {
  return (
    <div className="movie-badge">
      <h3>{title || 'Pealkiri puudub'}</h3>
      <span>Hinne: {rating}/5</span>
    </div>
  );
}

function UserGreeting({ username }) {
  return (
    <div>
      {username ? <p>Tere, {username}!</p> : <p>Palun logi sisse</p>}
    </div>
  );
}

// 3. Täpselt 6 ühiktesti
describe('CineRating ühiktestid (JSX)', () => {
  test('1. validateUsername - kontrollib kasutajanime reegleid', () => {
    expect(validateUsername('karl123')).toBe(true);
    expect(validateUsername('ab')).toBe(false);
  });

  test('2. validateEmail - kontrollib e-maili formaati', () => {
    expect(validateEmail('test@test.com')).toBe(true);
    expect(validateEmail('vigane-email')).toBe(false);
  });

  test('3. validateRating - kontrollib hinde vahemikku (1-5)', () => {
    expect(validateRating(4)).toBe(true);
    expect(validateRating(6)).toBe(false);
  });

  test('4. canUserReviewMovie - takistab duplikaatarvustuse lisamist', () => {
    const existingReviews = [{ userId: 1, movieId: 10 }];
    expect(canUserReviewMovie(existingReviews, 1, 10)).toBe(false);
    expect(canUserReviewMovie(existingReviews, 2, 10)).toBe(true);
  });

  test('5. MovieBadge (JSX) - renderdab filmi pealkirja ja hinde', () => {
    render(<MovieBadge title="Inception" rating={5} />);
    expect(screen.getByText('Inception')).toBeInTheDocument();
    expect(screen.getByText('Hinne: 5/5')).toBeInTheDocument();
  });

  test('6. UserGreeting (JSX) - kuvab sisselogitud kasutaja nime', () => {
    render(<UserGreeting username="karl123" />);
    expect(screen.getByText('Tere, karl123!')).toBeInTheDocument();
  });
});