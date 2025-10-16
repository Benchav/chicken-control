import React, { createContext, useContext, useState, ReactNode } from 'react';
import { userData } from '@/data/user.data';
import { User } from '@/models/user.model';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (payload: Omit<User, 'id'>) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem('user');
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  });

  const login = async (email: string, password: string) => {
    const found = userData.find((u) => u.email === email && u.password === password);
    if (found) {
      setUser(found);
      try { localStorage.setItem('user', JSON.stringify(found)); } catch {}
      return true;
    }
    return false;
  };

  const register = async (payload: Omit<User, 'id'>) => {
    // simple in-memory register, ensure email unique
    const exists = userData.find((u) => u.email === payload.email);
    if (exists) return false;
    const newUser: User = { id: Math.random().toString(36).slice(2, 9), ...payload };
    userData.push(newUser);
    setUser(newUser);
    try { localStorage.setItem('user', JSON.stringify(newUser)); } catch {}
    return true;
  };

  const logout = () => setUser(null);

  // ensure logout clears localStorage
  const _logout = () => {
    try { localStorage.removeItem('user'); } catch {}
    logout();
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout: _logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export default AuthContext;
