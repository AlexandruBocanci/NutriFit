import React from 'react';
import './ProgressBar.css';

export default function ProgressBar({ current, goal, color }) {
  // Calculate the percentage of progress towards the goal
  const percentage = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;

  return (
    <div className="progress-bar">
      <div 
        className="progress-bar-fill" 
        style={{ width: `${percentage}%`, backgroundColor: color }} // Set the fill width and color
      >
        {percentage.toFixed(1)}% {/* Display percentage with one decimal place */}
      </div>
    </div>
  );
}
