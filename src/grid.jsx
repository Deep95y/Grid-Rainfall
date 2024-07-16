import React, { useState, useEffect } from 'react';
import './grid.css';

const Grid = ({ rows, cols }) => {
  const [grid, setGrid] = useState([]);
  const [dropPositions, setDropPositions] = useState([]);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    initializeGrid();
    initializeDrops();
  }, []);

  const initializeGrid = () => {
    const newGrid = Array.from({ length: rows }, () => Array.from({ length: cols }, () => ''));
    setGrid(newGrid);
  };

  const initializeDrops = () => {

    const newDrops = Array.from({ length: cols }, (_, index) => {

      if (Math.random() > 0.65) {
        return {
          length: 7,
          position: -Math.floor(Math.random() * rows),
        };
      } else {
        return {  
          length: 0, 
          position: -rows, 
        };
      }
    }); 
    setDropPositions(newDrops);
  };

  const getColor = (rowIndex, length, position, elapsedTime) => {
    const colorCycleInterval = 20
    const cyclePosition = elapsedTime % colorCycleInterval / colorCycleInterval;
    const colors = [
      { r: 0, g: 0, b: 0 },        // Black
      { r: 255, g: 255, b: 0 },    // Yellow
      { r: 0, g: 0, b: 255 },      // Blue
      { r: 255, g: 0, b: 255 },    // Pink
      { r: 0, g: 0, b: 139 },      // Dark Blue
      { r: 255, g: 255, b: 255 },  // White
      { r: 0, g: 0, b: 139 },      // Dark Blue
      { r: 255, g: 0, b: 255 },    // Pink
      { r: 0, g: 0, b: 255 },      // Blue
      { r: 255, g: 255, b: 0 },    // Yellow
    ];  

    const colorIndex = Math.floor(cyclePosition * (colors.length - 1));
    const nextColorIndex = (colorIndex + 1) % colors.length;
    const mixRatio = (cyclePosition * (colors.length - 1)) % 1;

    const finalColor = {
      r: Math.floor(colors[colorIndex].r * (1 - mixRatio) + colors[nextColorIndex].r * mixRatio),
      g: Math.floor(colors[colorIndex].g * (1 - mixRatio) + colors[nextColorIndex].g * mixRatio),
      b: Math.floor(colors[colorIndex].b * (1 - mixRatio) + colors[nextColorIndex].b * mixRatio)
    };

    const relativePosition = rowIndex - position;
    const intensity = Math.max(0, Math.min(1, relativePosition / length));

    const r = Math.floor(finalColor.r * intensity);
    const g = Math.floor(finalColor.g * intensity);
    const b = Math.floor(finalColor.b * intensity);

    return `rgb(${r}, ${g}, ${b})`;
  };

  const updateGrid = () => {
    setGrid(prevGrid => {
      const newGrid = prevGrid.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const drop = dropPositions[colIndex];
          if (rowIndex >= drop.position && rowIndex < drop.position + drop.length) {
            return getColor(rowIndex, drop.length, drop.position, Date.now() / 1000);
          }
          return '';
        })
      );
      return newGrid;
    });

    setDropPositions(prevDrops =>
      prevDrops.map(drop => {
        if (drop.length === 0) {
          return drop;
        } else {
          return {
            ...drop,
            position: drop.position >= rows ? -Math.floor(Math.random() * rows) : drop.position + 1,
          };
        }
      })
    );
  };

  useEffect(() => {
    if (running) {
      const interval = setInterval(() => {
        updateGrid();
      }, 35);
      return () => clearInterval(interval);
    }
  }, [running, dropPositions]);

  return (
    <div>
      <div className="grid">
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className="cell"
              style={{ backgroundColor: cell }}
            ></div>
          ))
        )}
      </div>
      <br/>
      <div className="controls" style={{ marginLeft: '42%' }}>
        <button onClick={() => setRunning(!running)} style={{ height: '40px', width: '80px', background: 'purple', borderStyle: 'none', borderRadius: '10px', color: 'white' }}>
          {running ? 'Pause' : 'Start'}
        </button>
      </div>
    </div>
  );
};

export default Grid;
