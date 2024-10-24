import React, { useState, useEffect } from 'react';
import './WeightHistory.css';
import WeightGraph from './WeightGraph'; // Import WeightGraph

export default function WeightHistory() {
  const [weightLogs, setWeightLogs] = useState([]);
  const [newWeight, setNewWeight] = useState('');
  const [displayedLogs, setDisplayedLogs] = useState(7); // Initially display 7 records
  const [selectedLogIndex, setSelectedLogIndex] = useState(null); // Track selected log for deletion

  useEffect(() => {
    // Load weight history from localStorage if available
    const savedWeightLogs = JSON.parse(localStorage.getItem('weightLogs')) || [];
    setWeightLogs(savedWeightLogs);
  }, []);

  const handleAddWeight = () => {
    if (newWeight.trim() === '') return; // Check if input is not empty

    const today = new Date().toLocaleDateString(); // Get today's date
    const updatedLogs = [{ weight: newWeight, date: today }, ...weightLogs]; // Add to the beginning of the list

    setWeightLogs(updatedLogs);
    localStorage.setItem('weightLogs', JSON.stringify(updatedLogs)); // Save to localStorage
    setNewWeight(''); // Clear input after adding
  };

  const handleDeleteWeight = (index) => {
    // Remove log at the specified index
    const updatedLogs = weightLogs.filter((_, logIndex) => logIndex !== index);
    setWeightLogs(updatedLogs);
    localStorage.setItem('weightLogs', JSON.stringify(updatedLogs)); // Save updated list
    setSelectedLogIndex(null); // Reset selection
  };

  const handleShowMore = () => {
    setDisplayedLogs((prev) => prev + 5); // Load 5 more records on button click
  };

  const handleLogClick = (index) => {
    // Toggle the index of the selected log to show/hide delete button
    setSelectedLogIndex(index === selectedLogIndex ? null : index);
  };

  return (
    <div className="weight-history">
      <h2>Weight History</h2>

      {/* Input to enter new weight */}
      <div className="input-section">
        <input
          type="number"
          value={newWeight}
          placeholder="Enter weight (kg)"
          onChange={(e) => setNewWeight(e.target.value)} // Update newWeight state on input change
        />
        <button onClick={handleAddWeight}>Add Weight</button>
      </div>

      {/* Pass weightLogs to the WeightGraph */}
      <WeightGraph weightLogs={weightLogs} />

      {/* Display weight logs */}
      <div className="log-section">
        {weightLogs.slice(0, displayedLogs).map((log, index) => (
          <div
            key={index}
            className="log-entry"
            onClick={() => handleLogClick(index)} // Show delete button on log click
          >
            <span>{log.date}</span> - <span>{log.weight} kg</span>
            {selectedLogIndex === index && (
              <button
                className="delete-button"
                onClick={() => handleDeleteWeight(index)} // Delete log on button click
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Show more button */}
      {displayedLogs < weightLogs.length && (
        <button onClick={handleShowMore} className="show-more">
          Show More
        </button>
      )}
    </div>
  );
}
