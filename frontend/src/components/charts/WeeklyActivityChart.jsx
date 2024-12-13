import React from "react";
import { Line } from "react-chartjs-2";

const WeeklyActivityChart = () => {
  const data = {
    labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    datasets: [
      {
        label: "Workouts Completed",
        data: [2, 1, 2, 3, 2, 4, 1],
        borderColor: "#1DB954",
        backgroundColor: "rgba(29, 185, 84, 0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    plugins: { legend: { display: true } },
    scales: { y: { beginAtZero: true } },
  };

  return <Line data={data} options={options} />;
};

export default WeeklyActivityChart;
