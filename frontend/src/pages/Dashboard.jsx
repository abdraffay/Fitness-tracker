import React, { useState, useEffect } from "react";
import { getLoggedInUser } from "../services/DataService";
import WorkoutLogsChart from "../components/charts/WorkoutLogsChart";
import NutritionLogsChart from "../components/charts/NutritionLogsChart";
import ProgressChart from "../components/charts/ProgressChart";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [workoutLogs, setWorkoutLogs] = useState([]);
  const [nutritionLogs, setNutritionLogs] = useState([]);
  const [progressLogs, setProgressLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Redirect to login if no token
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        console.error("No token found. Please log in.");
        return;
      }

      try {
        // Call your API to get the user details
        const response = await fetch(`http://localhost:5000/user/${getUserIdFromToken(token)}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          setWorkoutLogs(userData.logs?.workouts || []);
          setNutritionLogs(userData.logs?.nutrition || []);
          setProgressLogs(userData.logs?.progress || []);
        } else {
          console.error("Failed to fetch user details.");
          navigate("/login");
        }
      } catch (error) {
        console.error("Error fetching user:", error.message);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token, navigate]);

  const getUserIdFromToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
      return payload.id;
    } catch (error) {
      console.error("Invalid token format:", error);
      return null;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black animate-fade-in">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-red-600 rounded-full animate-bounce"></div>
          <p className="text-lg text-white">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <p className="text-center text-red-500 text-lg">
          No user is logged in. Please log in first.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-black text-white animate-fade-in">
      {/* Welcome Section */}
      <header className="max-w-5xl mx-auto p-6 mb-8 bg-gradient-to-r from-red-500 to-black rounded shadow-lg flex items-center justify-between animate-slide-in-down">
        <div>
          <h1 className="text-4xl font-bold">Welcome, {user.userName || "User"}!</h1>
          <p className="text-lg mt-2">Here’s your personalized fitness dashboard.</p>
        </div>
        <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-2xl font-bold">
          {user.userName ? user.userName[0].toUpperCase() : "U"}
        </div>
      </header>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {/* Workout Logs Chart */}
        <div className="p-6 bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-transform transform hover:scale-105 animate-slide-in-left">
          <h3 className="text-xl font-semibold text-red-400 mb-4 flex items-center">
            <span className="mr-2">🏋️‍♂️</span> Workout Logs
          </h3>
          {workoutLogs.length > 0 ? (
            <WorkoutLogsChart logs={workoutLogs} />
          ) : (
            <p className="text-gray-500">No workout data available.</p>
          )}
          <button
            onClick={() => console.log("View All Workouts")}
            className="mt-4 text-red-400 hover:text-white underline text-sm"
          >
            View All Workouts
          </button>
        </div>

        {/* Nutrition Logs Chart */}
        <div className="p-6 bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-transform transform hover:scale-105 animate-slide-in-right">
          <h3 className="text-xl font-semibold text-red-400 mb-4 flex items-center">
            <span className="mr-2">🥗</span> Nutrition Logs
          </h3>
          {nutritionLogs.length > 0 ? (
            <NutritionLogsChart logs={nutritionLogs} />
          ) : (
            <p className="text-gray-500">No nutrition data available.</p>
          )}
          <button
            onClick={() => console.log("View All Nutrition Logs")}
            className="mt-4 text-red-400 hover:text-white underline text-sm"
          >
            View All Nutrition Logs
          </button>
        </div>

        {/* Progress Chart */}
        <div className="p-6 bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-transform transform hover:scale-105 animate-slide-in-left">
          <h3 className="text-xl font-semibold text-red-400 mb-4 flex items-center">
            <span className="mr-2">📈</span> Progress Tracking
          </h3>
          {progressLogs.length > 0 ? (
            <ProgressChart logs={progressLogs} />
          ) : (
            <p className="text-gray-500">No progress data available.</p>
          )}
          <button
            onClick={() => console.log("View All Progress Logs")}
            className="mt-4 text-red-400 hover:text-white underline text-sm"
          >
            View All Progress Logs
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
