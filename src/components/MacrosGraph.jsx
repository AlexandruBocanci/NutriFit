import React from 'react';
import { Bar } from 'react-chartjs-2';
import "./MacrosGraph.css"
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

// Register necessary components
Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);


export default function MacrosGraph({ weeklyData, selectedMacro }) {
  const labels = weeklyData.map(entry => entry.date);
  const dataPoints = weeklyData.map(entry => entry[selectedMacro]);

  const data = {
    labels: labels,
    datasets: [
      {
        label: `${selectedMacro.charAt(0).toUpperCase() + selectedMacro.slice(1)}`,
        data: dataPoints,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: true,
        text: `Weekly ${selectedMacro} Intake`,
      },
    },
  };

  return <Bar data={data} options={options} />;
}
