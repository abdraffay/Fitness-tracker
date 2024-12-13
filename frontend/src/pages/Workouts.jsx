import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Workouts = () => {
  const [exercises, setExercises] = useState([]);
  const [workoutLog, setWorkoutLog] = useState([{ exercise: "", sets: "", reps: "", weight: "" }]);
  const [previousLogs, setPreviousLogs] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Fetch exercises
        const exercisesResponse = await fetch("http://localhost:5000/exercises", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!exercisesResponse.ok) throw new Error("Failed to fetch exercises");
        const exercisesData = await exercisesResponse.json();
        setExercises(exercisesData);

        // Fetch user workouts
        const userId = localStorage.getItem("userId");
        const userResponse = await fetch(`http://localhost:5000/userWorkout/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!userResponse.ok) throw new Error("Failed to fetch user workouts");
        const userData = await userResponse.json();
        setPreviousLogs(categorizeLogsByDate(userData));
      } catch (error) {
        toast.error("Failed to load data. Please try again.");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const categorizeLogsByDate = (workouts) => {
    const categorized = {};
    workouts.forEach((workout) => {
      const date = new Date(workout.createdAt).toLocaleDateString();
      if (!categorized[date]) categorized[date] = { workouts: [] };
      categorized[date].workouts.push(workout);
    });
    return categorized;
  };

  const addNewExercise = () => {
    setWorkoutLog((prev) => [...prev, { exercise: "", sets: "", reps: "", weight: "" }]);
    toast.info("New exercise field added!");
  };

  const removeExercise = (index) => {
    if (workoutLog.length === 1) {
      toast.error("At least one exercise must be logged.");
      return;
    }
    setWorkoutLog(workoutLog.filter((_, i) => i !== index));
    toast.info("Exercise field removed.");
  };

  const updateExercise = (index, key, value) => {
    const updatedLog = [...workoutLog];
    updatedLog[index][key] = value;
    setWorkoutLog(updatedLog);
  };

  const validateFields = () => {
    const isValid = workoutLog.every((entry) => entry.exercise && entry.sets && entry.reps && entry.weight);
    if (!isValid) toast.error("Please fill in all fields for each exercise!");
    return isValid;
  };

  const handleLogWorkout = async () => {
    if (!validateFields()) return;

    const workoutEntry = {
      name: "Workout Log",
      category: "Strength Training",
      exercises: workoutLog,
      userId: localStorage.getItem("userId"),
    };

    try {
      const response = await fetch("http://localhost:5000/workout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(workoutEntry),
      });

      if (!response.ok) throw new Error("Failed to log workout");

      toast.success("Workout logged successfully!");
      setWorkoutLog([{ exercise: "", sets: "", reps: "", weight: "" }]);

      const date = new Date().toLocaleDateString();
      setPreviousLogs((prev) => {
        if (!prev[date]) prev[date] = { workouts: [] };
        prev[date].workouts = [...(prev[date].workouts || []), ...workoutLog];
        return { ...prev };
      });
    } catch (error) {
      toast.error("Failed to log workout.");
      console.error("Error logging workout:", error);
    }
  };

  const handleDropdownToggle = (date) => {
    setOpenDropdown((prev) => (prev === date ? null : date));
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
        <div className="space-y-6">
          {workoutLog.map((entry, index) => (
            <div key={index} className="space-y-4 p-4 border rounded bg-card">
              <div className="flex justify-between items-center">
                <select
                  className="w-full p-3 bg-black text-white rounded focus:outline-none"
                  value={entry.exercise}
                  onChange={(e) => updateExercise(index, "exercise", e.target.value)}
                >
                  <option value="">Select an Exercise</option>
                  {exercises.map((exercise, i) => (
                    <option key={i} value={exercise.exercise}>
                      {exercise.exercise}
                    </option>
                  ))}
                </select>
                {index > 0 && (
                  <button onClick={() => removeExercise(index)} className="ml-3 p-2 bg-red-500 text-white rounded">
                    Remove
                  </button>
                )}
              </div>
              <input
                type="number"
                placeholder="Sets"
                className="w-full p-3 bg-black text-white rounded"
                value={entry.sets}
                onChange={(e) => updateExercise(index, "sets", e.target.value)}
              />
              <input
                type="number"
                placeholder="Reps"
                className="w-full p-3 bg-black text-white rounded"
                value={entry.reps}
                onChange={(e) => updateExercise(index, "reps", e.target.value)}
              />
              <input
                type="number"
                placeholder="Weight (kg)"
                className="w-full p-3 bg-black text-white rounded"
                value={entry.weight}
                onChange={(e) => updateExercise(index, "weight", e.target.value)}
              />
            </div>
          ))}
          <button onClick={addNewExercise} className="w-full p-3 bg-primary text-white rounded">
            + Add Another Exercise
          </button>
        </div>
        <button onClick={handleLogWorkout} className="w-full p-3 bg-secondary text-white rounded">
          Log Workout
        </button>
        {Object.keys(previousLogs).length > 0 && (
          <div className="mt-8 bg-card p-6 rounded shadow-md">
            <h3 className="text-xl font-bold mb-4">Previous Logs by Date</h3>
            {Object.entries(previousLogs).map(([date, logs]) => (
              <details key={date} open={openDropdown === date} onClick={() => handleDropdownToggle(date)}>
                <summary>{date}</summary>
                <div>
                  {logs.workouts.map((log, i) => (
                    <p key={i}>
                      {log.name}: {log.sets} sets x {log.reps} reps, {log.weight} kg
                    </p>
                  ))}
                </div>
              </details>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Workouts;
