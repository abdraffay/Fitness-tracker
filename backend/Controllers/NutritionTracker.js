const NutritionTracking = require('../Models/NutritionTrakingModel');
const FoodItem = require("../Models/FoodItemModel");

// @METHOD    POST 
// @API       http://localhost:5000/nutritiontracking
const AddNutritionTracking = async (req, res) => {
    try {
      const { userId, quantity,meals } = req.body;
  

      if (!userId || !quantity || !meals || meals.length === 0) {
        return res.status(400).send({ error: "Please provide user ID and meals" });
      }
  
 
      for (const meal of meals) {
        for (const item of meal.foodItems) {
          const foodItem = await FoodItem.findById(item.foodItemId);
          if (!foodItem) {
            return res.status(400).send({ error: `Invalid foodItemId: ${item.foodItemId}` });
          }
        }
      }
  
      // Create new Nutrition Tracking entry
      const newEntry = await NutritionTracking.create({
        userId,
        quantity,
        meals,
      });
  
      if (newEntry) {
        return res.status(201).send({ message: "Nutrition tracking entry added successfully", newEntry });
      } else {
        return res.status(500).send({ error: "Failed to add nutrition tracking entry" });
      }
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  };
  
  // @METHOD    PUT
// @API       http://localhost:5000/nutritiontracking/:id
const UpdateNutritionTracking = async (req, res) => {
    try {
      const { id } = req.params;
      const { quantity,meals } = req.body;
  
      // Validation check
      if (!meals || meals.length === 0) {
        return res.status(400).send({ error: "Please provide meals to update" });
      }
  
      // Verify foodItemId existence in FoodItem collection
      for (const meal of meals) {
        for (const item of meal.foodItems) {
          const foodItem = await FoodItem.findById(item.foodItemId);
          if (!foodItem) {
            return res.status(400).send({ error: `Invalid foodItemId: ${item.foodItemId}` });
          }
        }
      }
  
      // Update Nutrition Tracking entry
      const updatedEntry = await NutritionTracking.findByIdAndUpdate(
        id,
        quantity,
        { meals },
        { new: true, runValidators: true }
      );
  
      if (updatedEntry) {
        return res.status(200).send({ message: "Nutrition tracking updated successfully", updatedEntry });
      } else {
        return res.status(404).send({ error: "Nutrition tracking entry not found" });
      }
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  };

  // @METHOD    DELETE
// @API       http://localhost:5000/nutritiontracking/:id
const DeleteNutritionTracking = async (req, res) => {
    try {
      const { id } = req.params;
  
      const deletedEntry = await NutritionTracking.findByIdAndDelete(id);
  
      if (deletedEntry) {
        return res.status(200).send({ message: "Nutrition tracking entry deleted successfully" });
      } else {
        return res.status(404).send({ error: "Nutrition tracking entry not found" });
      }
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  };

  // @METHOD    GET
// @API       http://localhost:5000/nutritiontracking/:userId
const GetNutritionTrackingByUser = async (req, res) => {
    try {
      const { userId } = req.params;
      const entries = await NutritionTracking.find({ userId }).populate({
        path: "meals.foodItems.foodItemId",
        select: "name calories macros",
      });
  
      if (entries.length > 0) {
        return res.status(200).send(entries );
      } else {
        return res.status(404).send({ error: "No nutrition tracking entries found for this user" });
      }
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  };
  
  
  module.exports = {
    AddNutritionTracking,
    UpdateNutritionTracking,
    DeleteNutritionTracking,
    GetNutritionTrackingByUser,
  };
  
  