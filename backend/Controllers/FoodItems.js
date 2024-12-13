const FoodItem = require("../Models/FoodItemModel");

// @METHOD    POST 
// @API       http://localhost:5000/fooditem
const AddFood = async(req,res)=>{
  try {
    const {name,calories,macros} = req.body; 

    // Validation checks
    if(!name ||!calories ||!macros){
       return res.status(400).send({"error": "Please enter all fields"});
    }
 
    const existingItem = await FoodItem.findOne({name:name});
    if(existingItem){
       return res.status(400).send({"error": "Food item already exists"});
    }
 
    const newFoodItem = await FoodItem.create({
     name:name,
     calories: calories,
     macros: macros
    });
 
    if(newFoodItem){
     return res.status(201).send({"message":"Food item added successfully"});
    }else{
     return res.status(500).send({"error":"Failed to add food item"});
    }
  } catch (error) {
    return res.status(500).send({"error":error.message});
  }

}

// @METHOD    POST 
// @API       http://localhost:5000/fooditem/
const GetFood = async(req,res)=>{
  try {
    const foodItem = await FoodItem.find();

    if(foodItem.length < 1) {
      return res.status(404).send({"error": "Food item not found"});
    }else{
      return res.status(200).send(foodItem);
    }
  } catch (error) {
    return res.status(500).send({"error":error.message});
  }

}

// @METHOD    UPDATE  
// @API       http://localhost:5000/fooditem/:id
const UpdateFood = async(req,res)=>{
    try {
      const {id} = req.params;
      const {name,calories,macros} = req.body;
  
      const existingItem = await FoodItem.findById(id);

      if(!existingItem){
        return res.status(404).send({"error": "Food item not found"});
      }

      // Validation checks
      if(!name ||!calories ||!macros){
         return res.status(400).send({"error": "Please enter all fields"});
      }
   
      
      if(name === existingItem.name){
         return res.status(400).send({"error": "Food item already exists"});
      }
   
      const modifiedItem = {
        name:name,
        calories: calories,
        macros: macros
      };
      const updatedItem = await FoodItem.findByIdAndUpdate(id, {$set: modifiedItem});
     
      if(updatedItem){
       return res.status(201).send({"message":"Food item updated successfully"});
      }else{
       return res.status(500).send({"error":"Failed to update food item"});
      }
    } catch (error) {
      return res.status(500).send({"error":error.message});
    }
  
}

// @METHOD    DELETE 
// @API       http://localhost:5000/fooditem/:id
const DeleteFood = async(req,res)=>{
  try {
    const {id} = req.params;

    const deleteItem = await FoodItem.findByIdAndDelete(id);
   
    if(deleteItem){
     return res.status(201).send({"message":"Food item deleted successfully"});
    }else{
     return res.status(500).send({"error":"Failed to delete food item"});
    }
  } catch (error) {
    return res.status(500).send({"error":error.message});
  }

}



module.exports = {AddFood,UpdateFood,GetFood,DeleteFood}