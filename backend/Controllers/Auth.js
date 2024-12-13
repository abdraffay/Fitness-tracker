const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserAccount = require("../Models/UserAccountModel")


// @METHOD    POST
// @API       http://localhost:5000/register
const UserRegister = async(req,res)=>{
  try { 
  const {userName,userEmail,userPassword} = req.body;

   // Username: allows alphabets only
   const userNameRegex = /^[a-zA-Z]+( [a-zA-Z]+)*$/;

     // Email: standard email format
     const userEmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
   
  //  Validations 
   if(!userNameRegex.test(userName)){
      return res.status(400).send({"error":"User name can contain only letters"});
   }

   if(!userEmailRegex.test(userEmail)){
      return res.status(400).send({"error":"Invalid email address"});
   }

   
   if(userPassword.length < 8){
      return res.status(400).send({"error":"Password must be at least 8 characters"});
   }
   console.log(!req.file);
    if(!req.file){
      return res.status(400).send({"error":"User Image must be specified"});
    }
    const cloudinaryImage = req.file.path;
    
   
 // Check Existing User name and email
 const existingName = await UserAccount.findOne({ userName: userName });
 const existingEmail = await UserAccount.findOne({ userEmail: userEmail });
   if(existingName){
      return res.status(400).send({"error":"User name already exists"});
   }
   if(existingEmail){
      return res.status(400).send({"error":"Email already exists"});
   }

   // Hash Password
   const hashedPassword = await bcrypt.hash(userPassword,10);
   const user = await UserAccount.create({
     userName: userName,
     userEmail: userEmail,
     userImage: cloudinaryImage,
     userPassword: hashedPassword
   });

   if(user){
      return res.status(201).send({"message":"User registered successfully"});
  }else{
      return res.status(500).send({"error":"Failed to register user"});
  }



} catch (error) {
  return res.send({"error":error.message})
}

};



// @METHOD    POST 
// @API       http://localhost:5000/login 
const UserLogin = async(req,res)=>{
    const {userEmail,userPassword} = req.body;
    if(!userEmail ||!userPassword){
        return res.status(400).send({"error":"User Email and password are required"});
    }
 
    const user = await UserAccount.findOne({ userEmail: userEmail });
   
    if(!user){
        return res.status(404).send({"error":"Invalid credentials p"});
    }

    const validPassword = await bcrypt.compare(userPassword, user.userPassword);
    if(!validPassword){
        return res.status(404).send({"error":"Invalid credentials"});
    }
    const token = jwt.sign({id: user._id}, process.env.TOKEN_SECRET, {expiresIn: '1hr'});
    return res.status(200).send({
        message: "Login Successful",
        token: token,  
      });
}


// @METHOD    POST 
// @API       http://localhost:5000/user/:id
const UserGet = async(req, res) =>{
    try {
   
        const user = await UserAccount.findById({ _id: req.params.id });
        
        if (!user) {
          return res.status(404).send({ error: "user not found" });
        }
        
    
        return res.status(200).send(user);
      } catch (error) {
        return res.status(500).send({ error: error.message });
      }
}

// @METHOD    PUT
// @API       http://localhost:5000/updateProfile/:id
const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { userName, userEmail } = req.body; 
    const userImage = req.file ? req.file.path : null;

    // Username: allows alphabets only
    const userNameRegex = /^[a-zA-Z]+( [a-zA-Z]+)*$/;

    // Email: standard email format
    const userEmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Fetch the user to update
    const user = await UserAccount.findById(id);
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    // Validate inputs if provided
    if (userName && !userNameRegex.test(userName)) {
      return res.status(400).send({ error: "User name can contain only letters" });
    }
    if (userEmail && !userEmailRegex.test(userEmail)) {
      return res.status(400).send({ error: "Invalid email address" });
    }

    // Check for duplicate username or email (if updating either)
    if (userName && userName !== user.userName) {
      const existingName = await UserAccount.findOne({ userName });
      if (existingName) {
        return res.status(400).send({ error: "User name already exists" });
      }
    }
    if (userEmail && userEmail !== user.userEmail) {
      const existingEmail = await UserAccount.findOne({ userEmail });
      if (existingEmail) {
        return res.status(400).send({ error: "Email already exists" });
      }
    }

    // Update fields if provided
    if (userName) user.userName = userName;
    if (userEmail) user.userEmail = userEmail;
    if (userImage) user.userImage = userImage;

    // Save updated user
    const updatedUser = await user.save();
    return res.status(200).send({
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        userName: updatedUser.userName,
        userEmail: updatedUser.userEmail,
        userImage: updatedUser.userImage,
      },
    });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};



module.exports = {UserRegister,UserLogin,UserGet,updateProfile}