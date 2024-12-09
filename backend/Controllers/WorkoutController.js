const Workouts = require("../Models/WorkoutModel");

// @METHOD    POST 
// @API       http://localhost:5000/workout
const addWorkout = async (req, res) => {
    try {
      const { userId, name, category, exercises } = req.body;
  
      if (!userId || !name || !category) {
        return res.status(400).send({ error: "User ID, name, and category are required" });
      }
  
      const workout = await Workouts.create({
        userId,
        name,
        category,
        exercises,
      });
  
      return res.status(201).send({
        message: "Workout added successfully",
        workout,
      });
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  };

// @METHOD    GET
// @API       http://localhost:5000/workout
  const getAllWorkouts = async (req, res) => {
    try {
      const workouts = await Workouts.find({}).populate("userId", "userName userEmail");
      return res.status(200).send(workouts);
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  };

// @METHOD    GET 
// @API       http://localhost:5000/userWorkout/:userId
  const getUserWorkouts = async (req, res) => {
    try {
      const { userId } = req.params;
      const workouts = await Workouts.find({ userId }).populate("userId", "userName userEmail");
  
      if (!workouts || workouts.length === 0) {
        return res.status(404).send({ error: "No workouts found for this user" });
      }
  
      return res.status(200).send(workouts);
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  };

// @METHOD    GET
// @API       http://localhost:5000/workout/:id
  const getWorkoutById = async (req, res) => {
    try {
      const { id } = req.params;
  
      const workout = await Workouts.findById(id).populate("userId", "userName userEmail");
  
      if (!workout) {
        return res.status(404).send({ error: "Workout not found" });
      }
  
      return res.status(200).send(workout);
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  };
  
// @METHOD    PUT
// @API       http://localhost:5000/workout/:id
  const updateWorkout = async (req, res) => {
    try {
      const { id } = req.params;
      const { name, category, exercises } = req.body;
  
      const workout = await Workouts.findById(id);
  
      if (!workout) {
        return res.status(404).send({ error: "Workout not found" });
      }
  
      // Update fields if provided
      if (name) workout.name = name;
      if (category) workout.category = category;
      if (exercises) workout.exercises = exercises;
  
      const updatedWorkout = await workout.save();
  
      return res.status(200).send({
        message: "Workout updated successfully",
        workout: updatedWorkout,
      });
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  };

  
// @METHOD    DELETE
// @API       http://localhost:5000/workout/:id
  const deleteWorkout = async (req, res) => {
    try {
      const { id } = req.params;
  
      const workout = await Workouts.findByIdAndDelete(id);
  
      if (!workout) {
        return res.status(404).send({ error: "Workout not found" });
      }
  
      return res.status(200).send({
        message: "Workout deleted successfully",
        workout,
      });
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  };

  module.exports = {
    addWorkout,
    getAllWorkouts,
    getUserWorkouts,
    getWorkoutById,
    updateWorkout,
    deleteWorkout,
  } 