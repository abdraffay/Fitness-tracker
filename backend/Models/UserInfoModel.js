const mongoose = require("mongoose");

const UserInfoModel = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserAccount",
        required: true,
      },
    userAge: {
        type: Number,
        required: [true, "User Age must be provided"],
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
        required: [true, "Gender must be specified"],
    },
    height: {
        type: Number, // Consider using centimeters or inches
        required: [true, "Height must be provided"],
    },
    weight: {
        type: Number, // Consider using kilograms or pounds
        required: [true, "Weight must be provided"],
    },
    targetWeight: {
        type: Number, // Consider using kilograms or pounds
        required: [true, "Target Weight must be provided"],
    },
    activityLevel: {
        type: String,
        enum: ["Sedentary", "Lightly Active", "Moderately Active", "Very Active", "Super Active"],
        required: [true, "Activity Level must be specified"],
    },
    weeklyGoal: {
        type: String,
        required: [true, "Weekly Goal must be specified"],
    },
});

const UserInfo = mongoose.model("UserInfo", UserInfoModel);

module.exports = UserInfo;