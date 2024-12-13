const mongoose = require("mongoose");

const exercisesModel = mongoose.Schema(
    {
        exercise:{
            type:String,
            require:true
        }
    }
)

const Exercises = mongoose.model("Exercises", exercisesModel);
module.exports ={Exercises}