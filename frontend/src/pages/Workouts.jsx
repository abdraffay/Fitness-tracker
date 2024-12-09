import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Workouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [workoutLog, setWorkoutLog] = useState([{ exercise: "", sets: "", reps: "", weight: "" }]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadWorkouts = async () => {
      try {
        const response = await fetch("http://localhost:5000/workout");
        if (!response.ok) throw new Error("Failed to fetch workouts");
        const data = await response.json();
        setWorkouts(data);
      } catch (error) {
        toast.error("Failed to load workouts. Please try again.");
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadWorkouts();
  }, []);

  const addNewExercise = () => {
    setWorkoutLog((prev) => [...prev, { exercise: "", sets: "", reps: "", weight: "" }]);
    toast.info("New exercise field added!");
  };

  const removeExercise = (index) => {
    if (workoutLog.length === 1) {
      toast.error("At least one exercise must be logged.");
      return;
    }
    setWorkoutLog((prev) => prev.filter((_, i) => i !== index));
    toast.info("Exercise field removed.");
  };

  const updateExercise = (index, key, value) => {
    const updatedLog = [...workoutLog];
    updatedLog[index][key] = value;
    setWorkoutLog(updatedLog);
  };

  const validateFields = () => {
    const isValid = workoutLog.every((entry) => entry.exercise && entry.sets && entry.reps && entry.weight);
    if (!isValid) {
      toast.error("Please fill in all fields for each exercise!");
      return false;
    }
    return true;
  };

  const handleLogWorkout = async () => {
    if (!validateFields()) return;

    const workoutEntry = {
      userId: localStorage.getItem("userId"), // Assuming userId is stored in localStorage
      name: "Custom Workout", // Placeholder name
      category: "General", // Placeholder category
      exercises: workoutLog,
    };

    try {
      const response = await fetch("http://localhost:5000/workout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(workoutEntry),
      });

      if (!response.ok) throw new Error("Failed to log workout");

      const newWorkout = await response.json();
      setWorkouts((prev) => [...prev, newWorkout.workout]);
      toast.success("Workout logged successfully!");

      // Reset workout log
      setWorkoutLog([{ exercise: "", sets: "", reps: "", weight: "" }]);
    } catch (error) {
      toast.error("Failed to log workout.");
      console.error("Error logging workout:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-background">
        <div className="loader"></div>
        <p className="text-white ml-4">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-background text-textPrimary min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center animate-fadeIn">Log Your Workouts</h2>

      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Current Workout Log */}
        <div className="space-y-6">
          {workoutLog.map((entry, index) => (
            <div
              key={index}
              className="space-y-4 p-4 border rounded bg-card transition-transform transform hover:scale-105 hover:shadow-lg"
            >
              <div className="flex justify-between items-center">
                <input
                  type="text"
                  placeholder="Exercise Name"
                  className="w-full p-3 bg-black text-white rounded focus:outline-none focus:ring-2 focus:ring-secondary"
                  value={entry.exercise}
                  onChange={(e) => updateExercise(index, "exercise", e.target.value)}
                />
                {index > 0 && (
                  <button
                    onClick={() => removeExercise(index)}
                    className="ml-3 p-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                  >
                    Remove
                  </button>
                )}
              </div>
              <input
                type="number"
                placeholder="Sets"
                className="w-full p-3 bg-black text-white rounded focus:outline-none focus:ring-2 focus:ring-secondary"
                value={entry.sets}
                onChange={(e) => updateExercise(index, "sets", e.target.value)}
              />
              <input
                type="number"
                placeholder="Reps"
                className="w-full p-3 bg-black text-white rounded focus:outline-none focus:ring-2 focus:ring-secondary"
                value={entry.reps}
                onChange={(e) => updateExercise(index, "reps", e.target.value)}
              />
              <input
                type="number"
                placeholder="Weight (kg)"
                className="w-full p-3 bg-black text-white rounded focus:outline-none focus:ring-2 focus:ring-secondary"
                value={entry.weight}
                onChange={(e) => updateExercise(index, "weight", e.target.value)}
              />
            </div>
          ))}

          {/* Add New Exercise Button */}
          <button
            type="button"
            onClick={addNewExercise}
            className="w-full p-3 bg-primary text-white rounded hover:bg-primary-dark transition-transform transform hover:scale-105"
          >
            + Add Another Exercise
          </button>
        </div>

        {/* Log Workout Button */}
        <button
          onClick={handleLogWorkout}
          className="w-full p-3 bg-secondary text-white rounded hover:bg-secondary-dark transition-transform transform hover:scale-105"
        >
          Log Workout
        </button>

        {/* Display All Workouts */}
        {workouts.length > 0 && (
          <div className="mt-8 space-y-4 bg-card p-6 rounded shadow-md">
            <h3 className="text-xl font-bold mb-4">All Workouts</h3>
            {workouts.map((workout) => (
              <div key={workout._id} className="p-4 bg-black text-white rounded shadow-md">
                <h4 className="font-bold">{workout.name}</h4>
                <p>Category: {workout.category}</p>
                {workout.exercises.map((exercise, i) => (
                  <p key={i}>
                    • {exercise.exercise}: {exercise.sets} sets x {exercise.reps} reps, {exercise.weight} kg
                  </p>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Workouts;
