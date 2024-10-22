import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function WeightGraph() {
  const data = {
    labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'], // Zilele săptămânii
    datasets: [
      {
        label: 'Weight (kg)',
        data: [72, 71.5, 71, 71.2, 70.8, 70.5, 70], 
        borderColor: '#3e95cd',
        backgroundColor: 'rgba(62, 149, 205, 0.4)',
        fill: true,
        tension: 0.2, 
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
      title: {
        display: true,
        text: 'Weight Trend Over Last 7 Days',
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: 'Weight (kg)',
        },
      },
    },
  };

  return (
    <div>
      <Line data={data} options={options} />
    </div>
  );
}
