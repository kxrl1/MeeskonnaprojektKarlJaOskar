import { useState } from 'react';

export function useUser() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return { user, logout };
}