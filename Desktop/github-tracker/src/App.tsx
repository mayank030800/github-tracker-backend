import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/Home';
import RepositoryManager from './pages/RepositoryManager';


function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} /> 
      <Route path="/repositories" element={<RepositoryManager />} /> 
    </Routes>
  );
}

export default App;
