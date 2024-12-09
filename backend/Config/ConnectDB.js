const mongoose = require("mongoose");

const connectionDB = async()=>{
 try {
    const connection = mongoose.connect(process.env.DB);
    if (connection) {
        console.log(`Mongo Atlas is connected with ${process.env.PORT}`)
    } else {
        console.log(`Error while connecting Mongo Atlas with ${process.env.PORT}`)
    }
    
 } catch (error) {
    console.log(error.message)
 }
}
module.exports = {connectionDB} ;