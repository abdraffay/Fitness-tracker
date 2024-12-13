import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const ProgressChart = ({ logs }) => {
  if (!logs || logs.length === 0)
    return <p className="text-gray-500">No progress data available.</p>;

  const data = {
    labels: logs.map((log) => log.date),
    datasets: [
      {
        label: "Weight (kg)",
        data: logs.map((log) => log.weight),
        borderColor: "#FF5733",
        backgroundColor: "rgba(255, 87, 51, 0.2)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          color: "#333",
        },
      },
      tooltip: {
        callbacks: {
          label: (context) =>
            `${context.dataset.label}: ${context.raw.toLocaleString()} kg`,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#666",
        },
        grid: {
          display: false,
        },
      },
      y: {
        ticks: {
          color: "#666",
          beginAtZero: true,
        },
        grid: {
          color: "rgba(0,0,0,0.1)",
        },
      },
    },
  };

  return (
    <div className="h-[300px]">
      <Line data={data} options={options} />
    </div>
  );
};

export default ProgressChart;
