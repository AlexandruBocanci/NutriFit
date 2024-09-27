import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CalorieTracker from './pages/CalorieTracker';
import Progress from './pages/Progress';
import Account from './pages/Account';
import './App.css'; // Importă CSS-ul

export default function App() {
  return (
    <div className="app-container">
      <NavBar />
      <div className="content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tracker" element={<CalorieTracker />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/account" element={<Account />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}
