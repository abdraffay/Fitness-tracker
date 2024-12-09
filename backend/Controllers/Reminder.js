const Reminder = require("../Models/ReminderModel");

const setReminder = async (req, res) => {
  try {
    const { userId, time, message, type } = req.body;
    const newReminder = { userId, time, message, type };
    await Reminder.create(newReminder);
    setTimeout(() => {
      io.emit("notification", { userId, message, type });
    }, time * 60 * 1000); 
    res.status(200).send({ message: "Reminder set successfully!" });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};


const getReminders = async (req, res) => {
  try {
    const { userId } = req.params;
    const userReminders = await Reminder.find({ userId });
    res.status(200).json(userReminders);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

module.exports = {setReminder, getReminders}