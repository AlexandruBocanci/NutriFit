import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import "./WeightGraph.css";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function WeightGraph() {
  // Data for the chart
  const data = {
    labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7', 'Day 8'], // X-axis labels
    datasets: [
      {
        label: 'Weight (kg)', // Legend label for the dataset
        data: [72, 71.5, 71, 71.2, 70.8, 70.5, 70], // Data points for weight
        borderColor: '#3e95cd', // Line color
        backgroundColor: 'rgba(62, 149, 205, 0.4)', // Background color under the line
        fill: true, // Fill area under the line
        tension: 0.2, // Curvature of the line
      },
    ],
  };

  // Options for the chart
  const options = {
    responsive: true, // Make the chart responsive
    plugins: {
      legend: {
        display: true, // Show legend
      },
      title: {
        display: true, // Show title
        text: 'All time weight trend', // Title text
      },
    },
    scales: {
      y: {
        beginAtZero: false, // Y-axis does not start at zero
        title: {
          display: true, // Show title on Y-axis
          text: 'Weight (kg)', // Y-axis title text
        },
      },
    },
  };

  return (
    <div className='graph'>
      <Line data={data} options={options} /> {/* Render the line chart */}
    </div>
  );
}
