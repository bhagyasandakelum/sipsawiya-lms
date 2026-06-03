"use client"

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import api from '@/lib/api';

interface UserProfile {
  id: string;
  name: string;
  profilePicture?: string | null;
  institution?: string | null;
  academicLevel?: string | null;
  qualification?: string | null;
  experience?: string | null;
  specialization?: string | null;
  bio?: string | null;
}

interface User {
  id: string;
  email: string;
  role: 'GUEST' | 'STUDENT' | 'TEACHER' | 'ADMIN';
  isEmailVerified: boolean;
  createdAt: string;
  profile: UserProfile | null;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'STUDENT' | 'TEACHER';
  institution?: string;
  academicLevel?: string;
  qualification?: string;
  experience?: string;
  specialization?: string;
  bio?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Try to restore session on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem('accessToken');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
          setAccessToken(storedToken);
          setUser(JSON.parse(storedUser));

          // Verify token is still valid by fetching profile
          try {
            const res = await api.get('/profile/me');
            if (res.data.success) {
              setUser(res.data.data);
              localStorage.setItem('user', JSON.stringify(res.data.data));
            }
          } catch {
            // Token expired, try refresh
            try {
              const refreshRes = await api.post('/auth/refresh-token');
              if (refreshRes.data.success) {
                const newToken = refreshRes.data.data.accessToken;
                setAccessToken(newToken);
                localStorage.setItem('accessToken', newToken);

                // Fetch profile with new token
                const profileRes = await api.get('/profile/me');
                if (profileRes.data.success) {
                  setUser(profileRes.data.data);
                  localStorage.setItem('user', JSON.stringify(profileRes.data.data));
                }
              }
            } catch {
              // Refresh also failed, clear everything
              clearAuth();
            }
          }
        }
      } catch {
        clearAuth();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const clearAuth = () => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  };

  const login = useCallback(async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });

    if (res.data.success) {
      const { accessToken: token, user: userData } = res.data.data;
      setAccessToken(token);
      setUser(userData);
      localStorage.setItem('accessToken', token);
      localStorage.setItem('user', JSON.stringify(userData));
    } else {
      throw new Error(res.data.message || 'Login failed');
    }
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    const res = await api.post('/auth/register', data);

    if (!res.data.success) {
      throw new Error(res.data.message || 'Registration failed');
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Logout even if API call fails
    }
    clearAuth();
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const res = await api.get('/profile/me');
      if (res.data.success) {
        setUser(res.data.data);
        localStorage.setItem('user', JSON.stringify(res.data.data));
      }
    } catch {
      // Silently fail
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
