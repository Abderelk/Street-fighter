import './App.css';
import { Route, Routes } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Home from './pages/Home';
import Login from './pages/Login';
import Inscription from './pages/Inscription';
import AuthMiddleware from './components/authMiddleware';
import Fight from './pages/Fight';
import AjoutPersonnage from './pages/AjoutPersonnage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const isLoginFromLocalStorage = localStorage.getItem('isLogin');
    return isLoginFromLocalStorage === 'true';
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const isLoginFromLocalStorage = localStorage.getItem('isLogin');
      setIsLoggedIn(isLoginFromLocalStorage === 'true');
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Login setIsLoggedIn={setIsLoggedIn} />
        }
      />
      <Route path="/inscription" element={<Inscription />} />
      <Route path="/home" element={<AuthMiddleware isAuthenticated={isLoggedIn}><Home /></AuthMiddleware>} ></Route>
      <Route path="/fight/:index" element={<AuthMiddleware isAuthenticated={isLoggedIn}><Fight /></AuthMiddleware>} ></Route>

      <Route path="/ajoutPersonnage" element={<AuthMiddleware isAuthenticated={isLoggedIn}><AjoutPersonnage /></AuthMiddleware>} />
    </Routes >
  );
}

export default App;
