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
        backgroundColor: '#bec7ed',
        borderColor: '#bec7ed',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'white' // Makes the y-axis grid lines white
        },
        ticks: {
          color: 'white' // Optional: makes the y-axis labels white
        }
      },
      x: {
        grid: {
          color: 'white' // Makes the x-axis grid lines white
        },
        ticks: {
          color: 'white' // Optional: makes the x-axis labels white
        }
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: 'white' // Makes legend text white
        }
      },
      title: {
        display: true,
        text: `Weekly ${selectedMacro} Intake`,
        color: 'white' // Title color
      },
    },
  };
  

  return <Bar data={data} options={options} />;
}
