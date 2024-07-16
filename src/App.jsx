
// src/App.js
import React from 'react';
import Grid from './grid';
import './App.css';

const App = () => {
  return (
    <div className="app">
      <h1>Rain Pattern Grid</h1>
      <Grid rows={15} cols={20} />
    </div>
  );
};

export default App;
