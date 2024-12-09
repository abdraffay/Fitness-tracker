const mongoose = require("mongoose");

const ReminderSchema = new mongoose.Schema({
  userId: String,
  time: Number, // Time in minutes
  message: String,
  type: String, // "Workout", "Meal", "Goal"
  createdAt: { type: Date, default: Date.now },
});

const Reminder = mongoose.model("Reminder", ReminderSchema);

module.exports = Reminder;
