// context/AuthContext.tsx

import React, { createContext, useState, useContext, ReactNode } from 'react';

type User = {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
};

type AuthContextValue = {
  user: User | null;
  signIn: (userData: User) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  signIn: () => {},
  signOut: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const signIn = (userData: User) => {
    setUser(userData);
  };

  const signOut = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

// Convenience hook
export function useAuth() {
  return useContext(AuthContext);
}
