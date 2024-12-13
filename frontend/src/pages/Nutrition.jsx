import React, { useState, useEffect } from "react";
import { fetchData, getLoggedInUser, logUserData } from "../services/DataService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Nutrition = () => {
  const [mealTypes, setMealTypes] = useState([]);
  const [nutritionItems, setNutritionItems] = useState([]);
  const [mealLog, setMealLog] = useState({
    mealType: "",
    items: [{ item: "", amount: "" }],
  });
  const [calculatedNutrition, setCalculatedNutrition] = useState(null);
  const [detailedLog, setDetailedLog] = useState([]);
  const [oldLogs, setOldLogs] = useState({});
  const [loading, setLoading] = useState(false);

  // Fetch meal types on load
  useEffect(() => {
    const loadMealTypes = async () => {
      try {
        const data = await fetchData();
        setMealTypes(data?.mealTypes || []);
      } catch (error) {
        toast.error("Failed to load meal types. Please try again.");
        console.error("Error loading meal types:", error);
      }
    };
    loadMealTypes();
  }, []);

  // Fetch nutrition items when meal type changes
  useEffect(() => {
    const loadItems = async () => {
      if (mealLog.mealType) {
        setLoading(true);
        try {
          const data = await fetchData();
          setNutritionItems(data?.nutritionItems[mealLog.mealType] || []);
        } catch (error) {
          toast.error("Failed to load nutrition items. Please try again.");
          console.error("Error loading nutrition items:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    loadItems();
  }, [mealLog.mealType]);

  // Fetch old logs
  useEffect(() => {
    const loadOldLogs = async () => {
      try {
        const user = await getLoggedInUser();
        if (user) {
          const categorizedLogs = categorizeLogsByDate(user.logs.nutrition || []);
          setOldLogs(categorizedLogs);
        } else {
          toast.error("Failed to fetch user data.");
        }
      } catch (error) {
        toast.error("Error fetching nutrition logs.");
        console.error(error);
      }
    };
    loadOldLogs();
  }, []);

  const addNewItem = () => {
    setMealLog((prev) => ({
      ...prev,
      items: [...prev.items, { item: "", amount: "" }],
    }));
    toast.info("New item field added!");
  };

  const removeItem = (index) => {
    if (mealLog.items.length === 1) {
      toast.error("At least one item must be present.");
      return;
    }
    const updatedItems = mealLog.items.filter((_, i) => i !== index);
    setMealLog({ ...mealLog, items: updatedItems });
    toast.info("Item field removed.");
  };

  const updateItem = (index, key, value) => {
    const updatedItems = [...mealLog.items];
    updatedItems[index][key] = value;
    setMealLog({ ...mealLog, items: updatedItems });
  };

  const validateFields = () => {
    if (!mealLog.mealType) {
      toast.error("Please select a meal type.");
      return false;
    }

    for (const { item, amount } of mealLog.items) {
      if (!item || !amount || parseFloat(amount) <= 0) {
        toast.error("Please ensure all items and amounts are valid.");
        return false;
      }
    }

    return true;
  };

  const calculateNutrition = () => {
    if (!validateFields()) return;

    const nutrition = { kcals: 0, protein: 0, carbs: 0, fat: 0 };
    const details = [];

    mealLog.items.forEach(({ item, amount }) => {
      const selectedItem = nutritionItems.find((i) => i.item === item);
      const qty = parseFloat(amount);

      if (selectedItem && qty > 0) {
        const itemNutrition = {
          item: selectedItem.item,
          kcals: (selectedItem.kcals * qty).toFixed(2),
          protein: (selectedItem.protein * qty).toFixed(2),
          carbs: (selectedItem.carbs * qty).toFixed(2),
          fat: (selectedItem.fat * qty).toFixed(2),
        };
        details.push(itemNutrition);

        nutrition.kcals += selectedItem.kcals * qty;
        nutrition.protein += selectedItem.protein * qty;
        nutrition.carbs += selectedItem.carbs * qty;
        nutrition.fat += selectedItem.fat * qty;
      }
    });

    setCalculatedNutrition({
      kcals: nutrition.kcals.toFixed(2),
      protein: nutrition.protein.toFixed(2),
      carbs: nutrition.carbs.toFixed(2),
      fat: nutrition.fat.toFixed(2),
    });
    setDetailedLog(details);

    const email = localStorage.getItem("authToken");
    const mealEntry = { ...mealLog, nutrition, date: new Date().toLocaleDateString() };
    logUserData(email, "nutrition", mealEntry);
    toast.success("Meal logged successfully!");
  };

  const categorizeLogsByDate = (logs) => {
    const categorized = {};
    logs.forEach((log) => {
      if (!categorized[log.date]) categorized[log.date] = [];
      categorized[log.date].push(log);
    });
    return categorized;
  };

  return (
    <div className="p-6 bg-background text-textPrimary min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center animate-fadeIn">Log Your Meals</h2>

      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Meal Type Selector */}
        <select
          className="w-full p-3 bg-black text-white rounded focus:outline-none focus:ring-2 focus:ring-secondary"
          value={mealLog.mealType}
          onChange={(e) =>
            setMealLog({ ...mealLog, mealType: e.target.value, items: [{ item: "", amount: "" }] })
          }
        >
          <option value="">Select a Meal Type</option>
          {mealTypes.map((type, index) => (
            <option key={index} value={type}>
              {type}
            </option>
          ))}
        </select>

        {/* Items and Amounts */}
        {mealLog.items.map((entry, index) => (
          <div
            key={index}
            className="space-y-4 p-4 border rounded bg-card transition-transform transform hover:scale-105 hover:shadow-lg"
          >
            <div className="flex justify-between items-center">
              <select
                className="w-full p-3 bg-black text-white rounded focus:outline-none focus:ring-2 focus:ring-secondary"
                value={entry.item}
                onChange={(e) => updateItem(index, "item", e.target.value)}
                disabled={!mealLog.mealType}
              >
                <option value="">Select an Item</option>
                {nutritionItems.map((item, i) => (
                  <option key={i} value={item.item}>
                    {item.item}
                  </option>
                ))}
              </select>
              {index > 0 && (
                <button
                  onClick={() => removeItem(index)}
                  className="ml-3 p-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                >
                  Remove
                </button>
              )}
            </div>
            <input
              type="number"
              placeholder="Amount (e.g., 2)"
              className="w-full p-3 bg-black text-white rounded focus:outline-none focus:ring-2 focus:ring-secondary"
              value={entry.amount}
              onChange={(e) => updateItem(index, "amount", e.target.value)}
            />
          </div>
        ))}

        {/* Add New Item */}
        <button
          type="button"
          onClick={addNewItem}
          className="w-full p-3 bg-primary text-white rounded hover:bg-primary-dark transition-transform transform hover:scale-105"
        >
          + Add Another Item
        </button>

        {/* Log Meal Button */}
        <button
          onClick={calculateNutrition}
          className="w-full p-3 bg-secondary text-white rounded hover:bg-secondary-dark transition-transform transform hover:scale-105"
        >
          Log Meal
        </button>

        {/* Detailed Log */}
        {detailedLog.length > 0 && (
          <div className="mt-6 bg-card p-6 rounded shadow-md animate-fadeIn">
            <h3 className="text-lg font-bold mb-4">Meal Details</h3>
            <ul className="space-y-4">
              {detailedLog.map((item, i) => (
                <li key={i} className="p-4 bg-black text-white rounded shadow">
                  <strong>{item.item}</strong>
                  <p>Kcals: {item.kcals}</p>
                  <p>Protein: {item.protein}g</p>
                  <p>Carbs: {item.carbs}g</p>
                  <p>Fat: {item.fat}g</p>
                </li>
              ))}
            </ul>
            <div className="mt-6 p-4 bg-secondary text-white rounded shadow">
              <h4 className="font-bold">Total Nutrients</h4>
              <p>Kcals: {calculatedNutrition.kcals}</p>
              <p>Protein: {calculatedNutrition.protein}g</p>
              <p>Carbs: {calculatedNutrition.carbs}g</p>
              <p>Fat: {calculatedNutrition.fat}g</p>
            </div>
          </div>
        )}

        {loading && <div className="text-center mt-4 text-white">Loading...</div>}

        {/* Old Logs */}
        <div className="mt-8">
          <h3 className="text-2xl font-bold mb-4">Past Logs</h3>
          {Object.keys(oldLogs).map((date) => (
            <details key={date} className="mb-4">
              <summary className="cursor-pointer text-lg font-bold text-secondary">
                {date}
              </summary>
              <div className="mt-2 space-y-4">
                {oldLogs[date].map((log, index) => (
                  <div
                    key={index}
                    className="p-4 bg-card rounded shadow-md"
                  >
                    <strong>{log.mealType}</strong>
                    <p>Item: {log.item}</p>
                    <p>Amount: {log.amount}</p>
                  </div>
                ))}
              </div>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Nutrition;
