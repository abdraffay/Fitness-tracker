const UserInfo = require("../Models/UserInfoModel"); 

// Add user information
const AddUserInfo = async (req, res) => {
  try {
    const {
      userId,
      userAge,
      gender,
      height,
      weight,
      targetWeight,
      activityLevel,
      weeklyGoal,
    } = req.body;

    // Validation checks
    if (
      !userId ||
      !userAge ||
      !gender ||
      !height ||
      !weight ||
      !targetWeight ||
      !activityLevel ||
      !weeklyGoal
    ) {
      return res.status(400).send({ error: "Please enter all required fields" });
    }

    // Check if user info already exists for the provided userId
    const existingUserInfo = await UserInfo.findOne({ userId });
    if (existingUserInfo) {
      return res
        .status(400)
        .send({ error: "User information already exists for this user" });
    }

    // Create new user info record
    const newUserInfo = await UserInfo.create({
      userId,
      userAge,
      gender,
      height,
      weight,
      targetWeight,
      activityLevel,
      weeklyGoal,
    });

    if (newUserInfo) {
      return res
        .status(201)
        .send({ message: "User information added successfully" });
    } else {
      return res.status(500).send({ error: "Failed to add user information" });
    }
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

// Get user information by userId
const GetUserInfo = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).send({ error: "User ID is required" });
    }

    const userInfo = await UserInfo.findOne({ userId });

    if (!userInfo) {
      return res.status(404).send({ error: "User information not found" });
    }

    return res.status(200).send(userInfo);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

// Update user information by userId
const UpdateUserInfo = async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;

    if (!userId) {
      return res.status(400).send({ error: "User ID is required" });
    }

    const updatedUserInfo = await UserInfo.findOneAndUpdate(
      { userId },
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedUserInfo) {
      return res.status(404).send({ error: "User information not found" });
    }

    return res
      .status(200)
      .send({ message: "User information updated successfully", updatedUserInfo });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

// Delete user information by userId
const DeleteUserInfo = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).send({ error: "User ID is required" });
    }

    const deletedUserInfo = await UserInfo.findOneAndDelete({ userId });

    if (!deletedUserInfo) {
      return res.status(404).send({ error: "User information not found" });
    }

    return res
      .status(200)
      .send({ message: "User information deleted successfully" });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

module.exports = {
  AddUserInfo,
  GetUserInfo,
  UpdateUserInfo,
  DeleteUserInfo,
};
