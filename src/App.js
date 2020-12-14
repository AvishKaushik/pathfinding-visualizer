import React from 'react';
import logo from './logo.svg';
import PathfindingVisualizer from './PathfindingVisualizer/PathfindingVisualizer.jsx'
import './App.css';

function App() {
  document.title="Pathfinding Visualizer"
  return (
    <div className="App">
      <PathfindingVisualizer></PathfindingVisualizer>
    </div>
  );
}

export default App;
