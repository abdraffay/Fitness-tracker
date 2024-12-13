const mongoose = require("mongoose");

const FoodItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, 
    calories: { type: Number, required: true }, 
    macros: {
      carbs: { type: Number, default: 0 }, 
      protein: { type: Number, default: 0 },
      fat: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

const FoodItem = mongoose.model("FoodItem", FoodItemSchema);

module.exports = FoodItem;
