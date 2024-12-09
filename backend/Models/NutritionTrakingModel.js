const mongoose = require("mongoose");

const NutritionTrackingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserAccount",
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    quantity: { type: Number, required: true }, 
    meals: [
      {
        mealType: {
          type: String,
          enum: ["Breakfast", "Lunch", "Dinner", "Snacks"],
          required: true,
        },
        foodItems: [
          {
            foodItemId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "FoodItem", 
              required: true,
            },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

const NutritionTracking = mongoose.model(
  "NutritionTracking",
  NutritionTrackingSchema
);

module.exports = NutritionTracking;
