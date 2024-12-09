import React, { useState, useEffect } from "react";
import { getLoggedInUser, logUserData } from "../services/DataService";
import { toast } from "react-toastify";

const ProgressPage = () => {
  const [user, setUser] = useState(null);
  const [workoutLogs, setWorkoutLogs] = useState([]);
  const [nutritionLogs, setNutritionLogs] = useState([]);
  const [progressLogs, setProgressLogs] = useState([]);
  const [progressData, setProgressData] = useState({
    date: new Date().toISOString().split("T")[0],
    weight: "",
    workouts: [],
    nutrition: [],
    notes: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const loggedInUser = await getLoggedInUser();
        if (loggedInUser) {
          setUser(loggedInUser);
          setWorkoutLogs(loggedInUser.logs.workouts || []);
          setNutritionLogs(loggedInUser.logs.nutrition || []);
          setProgressLogs(loggedInUser.logs.progress || []);
        } else {
          toast.error("User not logged in.");
        }
      } catch (error) {
        toast.error("Failed to fetch user data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProgressData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddWorkout = (exercise) => {
    setProgressData((prev) => ({
      ...prev,
      workouts: [...prev.workouts, exercise],
    }));
  };

  const handleRemoveWorkout = (index) => {
    setProgressData((prev) => ({
      ...prev,
      workouts: prev.workouts.filter((_, i) => i !== index),
    }));
  };

  const handleAddNutrition = (item) => {
    setProgressData((prev) => ({
      ...prev,
      nutrition: [...prev.nutrition, item],
    }));
  };

  const handleRemoveNutrition = (index) => {
    setProgressData((prev) => ({
      ...prev,
      nutrition: prev.nutrition.filter((_, i) => i !== index),
    }));
  };

  const handleSaveProgress = async () => {
    if (!progressData.weight) {
      toast.error("Please enter your weight.");
      return;
    }

    const email = localStorage.getItem("authToken");
    const entry = {
      ...progressData,
      date: new Date(progressData.date).toLocaleDateString(),
    };

    try {
      await logUserData(email, "progress", entry);
      toast.success("Progress saved successfully!");
      setProgressLogs((prev) => [entry, ...prev]);
      setProgressData({
        date: new Date().toISOString().split("T")[0],
        weight: "",
        workouts: [],
        nutrition: [],
        notes: "",
      });
    } catch (error) {
      toast.error("Failed to save progress.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader"></div>
        <p className="text-white ml-4">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-background text-textPrimary min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center">Track Your Progress</h2>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Date and Weight */}
        <div className="p-4 bg-card rounded shadow-md">
          <label className="block text-lg font-semibold mb-2">Date</label>
          <input
            type="date"
            name="date"
            value={progressData.date}
            onChange={handleInputChange}
            className="w-full p-3 bg-black text-white rounded focus:outline-none focus:ring-2 focus:ring-secondary"
          />
        </div>
        <div className="p-4 bg-card rounded shadow-md">
          <label className="block text-lg font-semibold mb-2">Current Weight (kg)</label>
          <input
            type="number"
            name="weight"
            placeholder="Enter your weight"
            value={progressData.weight}
            onChange={handleInputChange}
            className="w-full p-3 bg-black text-white rounded focus:outline-none focus:ring-2 focus:ring-secondary"
          />
        </div>

        {/* Workouts Section */}
        <div className="p-4 bg-card rounded shadow-md">
          <h3 className="text-xl font-bold mb-4">Workouts</h3>
          {progressData.workouts.map((workout, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-gray-800 p-3 rounded mb-2"
            >
              <p>{workout.exercise}</p>
              <button
                onClick={() => handleRemoveWorkout(index)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ))}
          <select
            className="w-full p-3 bg-black text-white rounded mb-3 focus:outline-none focus:ring-2 focus:ring-secondary"
            onChange={(e) =>
              e.target.value &&
              handleAddWorkout({ exercise: e.target.value, date: progressData.date })
            }
          >
            <option value="">Add Workout</option>
            {workoutLogs.map((log, index) => (
              <option key={index} value={log.exercise}>
                {log.exercise}
              </option>
            ))}
          </select>
        </div>

        {/* Nutrition Section */}
        <div className="p-4 bg-card rounded shadow-md">
          <h3 className="text-xl font-bold mb-4">Nutrition</h3>
          {progressData.nutrition.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-gray-800 p-3 rounded mb-2"
            >
              <p>{item.item}</p>
              <button
                onClick={() => handleRemoveNutrition(index)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ))}
          <select
            className="w-full p-3 bg-black text-white rounded mb-3 focus:outline-none focus:ring-2 focus:ring-secondary"
            onChange={(e) =>
              e.target.value &&
              handleAddNutrition({ item: e.target.value, date: progressData.date })
            }
          >
            <option value="">Add Nutrition</option>
            {nutritionLogs.map((log, index) => (
              <option key={index} value={log.item}>
                {log.item}
              </option>
            ))}
          </select>
        </div>

        {/* Notes Section */}
        <div className="p-4 bg-card rounded shadow-md">
          <label className="block text-lg font-semibold mb-2">Additional Notes</label>
          <textarea
            name="notes"
            rows="3"
            placeholder="Enter any additional details about your progress"
            value={progressData.notes}
            onChange={handleInputChange}
            className="w-full p-3 bg-black text-white rounded focus:outline-none focus:ring-2 focus:ring-secondary"
          ></textarea>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSaveProgress}
          className="w-full p-3 bg-secondary text-white rounded hover:bg-secondary-dark transition-transform transform hover:scale-105"
        >
          Save Progress
        </button>

        {/* Previous Progress Logs */}
        <div className="p-4 bg-card rounded shadow-md mt-8">
          <h3 className="text-xl font-bold mb-4">Previous Progress Logs</h3>
          {progressLogs.length > 0 ? (
            progressLogs
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .map((log, index) => (
                <div
                  key={index}
                  className="p-3 bg-gray-800 rounded mb-3 shadow hover:shadow-lg"
                >
                  <p className="text-lg font-semibold">Date: {log.date}</p>
                  <p>Weight: {log.weight} kg</p>
                  <p>Notes: {log.notes || "No additional notes"}</p>
                </div>
              ))
          ) : (
            <p className="text-gray-500">No progress logs available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;
