'use client';
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const login = (email, password) => {
    // Mock login
    setUser({
      id: 'USR001',
      name: 'Mithul',
      email: email,
      phone: '+91 98765 43210',
      addresses: [
        {
          id: 1,
          label: 'Home',
          address: '42, Brigade Road, Koramangala',
          city: 'Bangalore',
          pincode: '560034',
          isDefault: true,
        },
        {
          id: 2,
          label: 'Office',
          address: '15, MG Road, Indiranagar',
          city: 'Bangalore',
          pincode: '560038',
          isDefault: false,
        },
      ],
    });
    setIsLoginOpen(false);
  };

  const signup = (name, email, phone, password) => {
    setUser({
      id: 'USR' + Date.now(),
      name,
      email,
      phone,
      addresses: [],
    });
    setIsLoginOpen(false);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user, isLoggedIn: !!user,
      login, signup, logout,
      isLoginOpen, setIsLoginOpen,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
