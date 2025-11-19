import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as loginAPI, signup as signupAPI, getMe } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await getMe();
        // Access data from your backend response structure
        setUser(response.data.data); // ← FIXED: Access nested data
      }
    } catch (error) {
      console.error('Auth check error:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await loginAPI(credentials);
      console.log('Login response:', response.data);
      
      // Extract data from your backend structure
      const userData = response.data.data;
      
      if (userData.token) {
        localStorage.setItem('token', userData.token);
        setUser(userData);
        return userData;
      } else {
        throw new Error('No token received');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signup = async (userData) => {
    try {
      const response = await signupAPI(userData);
      console.log('Signup response:', response.data);
      
      // Extract data from your backend structure
      const newUserData = response.data.data;
      
      if (newUserData.token) {
        localStorage.setItem('token', newUserData.token);
        setUser(newUserData);
        return newUserData;
      } else {
        throw new Error('No token received');
      }
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};