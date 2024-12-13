import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const WorkoutLogsChart = ({ logs }) => {
  if (!logs || logs.length === 0)
    return <p className="text-gray-500">No workout data available.</p>;

  const aggregatedData = logs.reduce((acc, log) => {
    const volume = log.sets * log.reps * log.weight;
    acc[log.exercise] = (acc[log.exercise] || 0) + volume;
    return acc;
  }, {});

  const data = {
    labels: Object.keys(aggregatedData),
    datasets: [
      {
        label: "Total Volume (kg)",
        data: Object.values(aggregatedData),
        backgroundColor: ["#FF5733", "#33FF57", "#3375FF", "#FFCC00", "#C70039"],
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
      <Bar data={data} options={options} />
    </div>
  );
};

export default WorkoutLogsChart;
