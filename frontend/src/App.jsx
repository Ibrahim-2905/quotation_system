import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Quotations from './pages/Quotations';
import QuotationDetail from './pages/QuotationDetail';
import QuotationEdit from './pages/QuotationEdit';  // ← Add this
import Navbar from './components/layout/Navbar';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          <Route path="/" element={<Navigate to="/dashboard" />} />
          
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Navbar />
                <Dashboard />
              </PrivateRoute>
            }
          />
          
          <Route
            path="/customers"
            element={
              <PrivateRoute>
                <Navbar />
                <Customers />
              </PrivateRoute>
            }
          />
          
          <Route
            path="/quotations"
            element={
              <PrivateRoute>
                <Navbar />
                <Quotations />
              </PrivateRoute>
            }
          />
          
          <Route
            path="/quotations/:id"
            element={
              <PrivateRoute>
                <Navbar />
                <QuotationDetail />
              </PrivateRoute>
            }
          />
          
          {/* ← Add this route */}
          <Route
            path="/quotations/edit/:id"
            element={
              <PrivateRoute>
                <Navbar />
                <QuotationEdit />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;