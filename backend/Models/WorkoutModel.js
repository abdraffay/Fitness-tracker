const mongoose = require("mongoose");

const WorkoutSchema = new mongoose.Schema(
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserAccount",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      category: {
        type: String,
        enum: ["Strength", "Cardio", "Flexibility", "Other"],
        required: true,
      },
      exercises: [
        {
          exerciseName: { type: String, required: true },
          sets: { type: Number, default: 0 },
          reps: { type: Number, default: 0 },
          weights: { type: Number, default: 0 },
          notes: { type: String, default: "" },
        },
      ],
      date: {
        type: Date,
        default: Date.now,
      },
    },
    { timestamps: true }
  );

const Workouts = mongoose.model("Workouts", WorkoutSchema);
module.exports = Workouts;