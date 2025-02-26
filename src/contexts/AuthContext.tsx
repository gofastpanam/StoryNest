import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { AuthService } from '../services/auth';
import { auth } from '../config/firebase';

// Define the shape of our context
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | null>(null);

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Listen to auth state changes
  useEffect(() => {
    console.log('Setting up auth state listener');
    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log('Auth state changed:', user ? 'User logged in' : 'No user');
      setUser(user);
      setLoading(false);
    });

    // Cleanup subscription
    return () => {
      console.log('Cleaning up auth state listener');
      unsubscribe();
    };
  }, []);

  // Auth methods
  const login = async (email: string, password: string) => {
    try {
      console.log('AuthContext: Attempting login');
      const { user } = await AuthService.login(email, password);
      console.log('AuthContext: Login successful, user:', user?.email);
      setUser(user);
    } catch (error) {
      console.error('AuthContext: Login error:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string) => {
    try {
      console.log('AuthContext: Attempting registration');
      const { user } = await AuthService.register(email, password);
      console.log('AuthContext: Registration successful, user:', user?.email);
      setUser(user);
    } catch (error) {
      console.error('AuthContext: Registration error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log('AuthContext: Attempting logout');
      await AuthService.logout();
      console.log('AuthContext: Logout successful');
      setUser(null);
    } catch (error) {
      console.error('AuthContext: Logout error:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      console.log('AuthContext: Attempting password reset');
      await AuthService.resetPassword(email);
      console.log('AuthContext: Password reset email sent');
    } catch (error) {
      console.error('AuthContext: Password reset error:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
