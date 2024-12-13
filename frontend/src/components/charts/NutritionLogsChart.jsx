import React from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const NutritionLogsChart = ({ logs, nutritionItems }) => {
  if (!logs || logs.length === 0)
    return <p className="text-gray-500">No nutrition data available.</p>;

  // Check if nutritionItems exists and reduce only when valid
  const aggregatedData = logs.reduce(
    (acc, log) => {
      const mealItems = nutritionItems?.[log.mealType]; // Access meal type safely
      const nutritionItem = mealItems?.find((item) => item.item === log.item);

      if (nutritionItem) {
        acc.kcals += nutritionItem.kcals * log.amount;
        acc.protein += nutritionItem.protein * log.amount;
        acc.carbs += nutritionItem.carbs * log.amount;
        acc.fat += nutritionItem.fat * log.amount;
      }
      return acc;
    },
    { kcals: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const data = {
    labels: ["Calories", "Protein (g)", "Carbs (g)", "Fat (g)"],
    datasets: [
      {
        data: [
          aggregatedData.kcals,
          aggregatedData.protein,
          aggregatedData.carbs,
          aggregatedData.fat,
        ],
        backgroundColor: ["#FF073A", "#1DB954", "#FFCC00", "#3375FF"],
        hoverBackgroundColor: ["#FF4D6A", "#1EE06E", "#FFE066", "#559AFF"],
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
            `${context.label}: ${context.raw.toLocaleString()} g`,
        },
      },
    },
  };

  return (
    <div className="h-[300px]">
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default NutritionLogsChart;
