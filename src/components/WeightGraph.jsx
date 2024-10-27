import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import './WeightGraph.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function WeightGraph({ weightLogs = [] }) {
  // Reverse the logs for the chart to show the newest entries on the right
  const reversedLogs = [...weightLogs].reverse(); 

  const labels = reversedLogs.map(log => log.date); // Use dates as labels on the X-axis
  const dataPoints = reversedLogs.map(log => parseFloat(log.weight)); // Use weights as data points

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Weight (kg)',
        data: dataPoints, // Dynamic data
        borderColor: '#6885d5',
        backgroundColor: 'rgba(62, 149, 205, 0.4)',
        fill: true,
        tension: 0.2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: 'white' // Legend text color
        }
      },
      title: {
        display: true,
        text: 'All time weight trend',
        color: 'white' // Title text color
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: 'white' // Y-axis grid lines color
        },
        title: {
          display: true,
          text: 'Weight (kg)',
          color: 'white' // Y-axis title color
        },
        ticks: {
          color: 'white' // Y-axis label color
        }
      },
      x: {
        grid: {
          color: 'white' // X-axis grid lines color
        },
        ticks: {
          color: 'white' // X-axis label color
        }
      }
    },
  };
  
  return (
    <div className='graph'>
      <Line data={data} options={options} />
    </div>
  );
}

