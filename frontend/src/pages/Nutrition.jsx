import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Nutrition = () => {
  const [mealTypes, setMealTypes] = useState([
    "Breakfast",
    "Lunch",
    "Dinner",
    "Snacks",
  ]);
  const [foodItems, setFoodItems] = useState([]);
  const [nutritionLog, setNutritionLog] = useState({
    userId: "", // This will be fetched from logged-in user details
    mealType: "",
    meals: [{ foodItemId: "", quantity: "" }],
  });
  const [userLogs, setUserLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFoodItems();
    fetchUserNutritionLogs();
  }, []);

  const fetchFoodItems = async () => {
    try {
      const response = await fetch("http://localhost:5000/fooditem");
      if (response.ok) {
        const data = await response.json();
        console.log(data); // Log to check the response
        setFoodItems(data);
      } else {
        throw new Error("Failed to fetch food items");
      }
    } catch (error) {
      toast.error("Error fetching food items.");
      console.error(error);
    }
  };

  const fetchUserNutritionLogs = async () => {
    try {
      const userId = localStorage.getItem("userId"); // Assuming the user ID is stored here
      setNutritionLog((prev) => ({ ...prev, userId }));

      const response = await fetch(
        `http://localhost:5000/nutritiontracking/${userId}`
      );
      if (response.ok) {
        const data = await response.json();
        setUserLogs(data);
      } else {
        throw new Error("Failed to fetch user logs");
      }
    } catch (error) {
      toast.error("Error fetching nutrition logs.");
      console.error(error);
    }
  };

  const handleAddMealField = () => {
    setNutritionLog((prev) => ({
      ...prev,
      meals: [...prev.meals, { foodItemId: "", quantity: "" }],
    }));
  };

  const handleRemoveMealField = (index) => {
    const updatedMeals = nutritionLog.meals.filter((_, i) => i !== index);
    setNutritionLog((prev) => ({ ...prev, meals: updatedMeals }));
  };

  const handleMealChange = (index, key, value) => {
    const updatedMeals = [...nutritionLog.meals];
    updatedMeals[index][key] = value;
    setNutritionLog((prev) => ({ ...prev, meals: updatedMeals }));
  };

  const handleLogNutrition = async () => {
    if (
      !nutritionLog.mealType ||
      nutritionLog.meals.some((m) => !m.foodItemId || !m.quantity)
    ) {
      toast.error("Please complete all fields before submitting.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/nutritiontracking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nutritionLog),
      });

      if (response.ok) {
        toast.success("Nutrition log added successfully!");
        fetchUserNutritionLogs(); // Refresh user logs
      } else {
        throw new Error("Failed to log nutrition");
      }
    } catch (error) {
      toast.error("Error logging nutrition.");
      console.error(error);
    }
  };

  return (
    <div className="p-6 bg-background text-textPrimary min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center">
        Log Your Nutrition
      </h2>

      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Meal Type Selector */}
        <select
          className="w-full p-3 bg-white rounded focus:outline-none focus:ring-2 focus:ring-secondary"
          value={nutritionLog.mealType}
          onChange={(e) =>
            setNutritionLog((prev) => ({ ...prev, mealType: e.target.value }))
          }
        >
          <option value="">Select a Meal Type</option>
          {mealTypes.map((type, index) => (
            <option key={index} value={type}>
              {type}
            </option>
          ))}
        </select>

        {/* Meal Items */}
        {nutritionLog.meals.map((meal, index) => (
          <div key={index} className="flex space-x-4 items-center">
            <select
              className="flex-1 p-3 bg-white rounded focus:outline-none focus:ring-2 focus:ring-secondary"
              value={meal.foodItemId}
              onChange={(e) =>
                handleMealChange(index, "foodItemId", e.target.value)
              }
            >
              <option value="">Select a Food Item</option>
              {foodItems.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              className="w-24 p-3 bg-white rounded focus:outline-none focus:ring-2 focus:ring-secondary"
              placeholder="Qty"
              value={meal.quantity}
              onChange={(e) =>
                handleMealChange(index, "quantity", e.target.value)
              }
            />
            {index > 0 && (
              <button
                className="p-2 bg-red-500 text-white rounded"
                onClick={() => handleRemoveMealField(index)}
              >
                Remove
              </button>
            )}
          </div>
        ))}

        <button
          className="w-full p-3 bg-primary text-white rounded hover:bg-primary-dark"
          onClick={handleAddMealField}
        >
          + Add Another Meal
        </button>

        <button
          className="w-full p-3 bg-secondary text-white rounded hover:bg-secondary-dark"
          onClick={handleLogNutrition}
        >
          Log Nutrition
        </button>

        {/* User Logs */}
        <div className="mt-8">
          <h3 className="text-2xl font-bold mb-4">Your Nutrition Logs</h3>
          {userLogs.length > 0 ? (
            userLogs.map((log) => (
              <div key={log._id} className="p-4 bg-card rounded shadow-md">
                <h4 className="font-bold">{log.mealType}</h4>
                <ul className="mt-2">
                  {log.meals.map((meal, i) => (
                    <li key={i}>
                      {meal.foodItemId.name} - {meal.quantity} units
                    </li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <p>No logs available. Start tracking your nutrition!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Nutrition;
