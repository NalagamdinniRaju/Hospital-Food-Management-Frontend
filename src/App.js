import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import ManagerDashboard from './components/ManagerDashboard';
import PantryDashboard from './components/PantryDashboard';
import DeliveryDashboard from './components/DeliveryDashboard';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <ToastContainer />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/manager" element={
            <PrivateRoute>
              <ManagerDashboard />
            </PrivateRoute>
          } />
          <Route path="/pantry" element={
            <PrivateRoute>
              <PantryDashboard />
            </PrivateRoute>
          } />
          <Route path="/delivery" element={
            <PrivateRoute>
              <DeliveryDashboard />
            </PrivateRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

