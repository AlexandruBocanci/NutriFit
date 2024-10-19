import React from 'react';
import './ProgressBar.css';

export default function ProgressBar({ current, goal, color }) {
  const percentage = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;

  return (
    <div className="progress-bar">
      <div 
        className="progress-bar-fill" 
        style={{ width: `${percentage}%`, backgroundColor: color }}
      >
        {percentage.toFixed(1)}%
      </div>
    </div>
  );
}
