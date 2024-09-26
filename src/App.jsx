import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import CalorieTracker from './pages/CalorieTracker';
import Progress from './pages/Progress';
import Account from './pages/Account';

export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tracker" element={<CalorieTracker />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/account" element={<Account />} />
      </Routes>
    </div>
  );
}

