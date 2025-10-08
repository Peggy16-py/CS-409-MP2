import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import ListView from './pages/ListView';
import GalleryView from './pages/GalleryView';
import DetailView from './pages/DetailView'; // Import DetailView component
import './App.css';

function App() {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <div className="App">
        <nav>
          <Link to="/">List View</Link>
          <Link to="/gallery">Gallery View</Link>
        </nav>

        <Routes>
          <Route path="/" element={<ListView />} />
          <Route path="/gallery" element={<GalleryView />} />
          {/* Add new route rule. :pokemonId is a dynamic placeholder */}
          <Route path="/details/:pokemonId" element={<DetailView />} /> 
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;