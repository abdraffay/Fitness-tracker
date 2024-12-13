const DATA_URL = "/dummyData.json";

// Fetch data from the JSON file
const fetchData = async () => {
  try {
    const response = await fetch(DATA_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch data:", error);
    throw error;
  }
};

// Simulate writing data (mock implementation)
const writeUserData = async (data) => {
  console.log("Simulated write of updated data:", data);
  // In a real application, this would send a request to save to a backend API.
};

// Log user-specific data
const logUserData = async (email, logType, logEntry) => {
  try {
    const data = await fetchData();
    const userIndex = data.users.findIndex((u) => u.email === email);

    if (userIndex >= 0) {
      const user = data.users[userIndex];
      if (!user.logs[logType]) {
        user.logs[logType] = [];
      }
      user.logs[logType].push(logEntry); // Add the new log entry

      // Simulate saving the updated user data
      await writeUserData(data);
      console.log(`Successfully logged ${logType} data for ${email}:`, logEntry);
    } else {
      console.error(`User with email ${email} not found.`);
    }
  } catch (error) {
    console.error(`Failed to log ${logType} data:`, error);
  }
};

// Update user logs (e.g., workouts, nutrition, progress)
const updateUserLogs = async (email, logType, logEntry) => {
  try {
    const data = await fetchData();
    const userIndex = data.users.findIndex((user) => user.email === email);

    if (userIndex >= 0) {
      const user = data.users[userIndex];
      if (!user.logs[logType]) {
        user.logs[logType] = [];
      }
      user.logs[logType].push(logEntry); // Add the new log entry

      // Save the updated data
      await writeUserData(data);
      console.log(`Successfully updated ${logType} logs for ${email}:`, logEntry);
      return { success: true };
    } else {
      console.error(`User with email ${email} not found.`);
      return { success: false, message: "User not found." };
    }
  } catch (error) {
    console.error(`Failed to update ${logType} logs:`, error);
    return { success: false, message: "An error occurred while updating logs." };
  }
};

// Log in a user
const loginUser = async (email, password) => {
  try {
    const data = await fetchData();
    const user = data.users.find((u) => u.email === email && u.password === password);

    if (user) {
      const token = btoa(email); // Encode email as a simple token
      localStorage.setItem("authToken", token); // Save token in localStorage
      console.log("Login successful. Token saved:", token);
      return { success: true, user };
    } else {
      console.error("Invalid credentials");
      return { success: false, message: "Invalid email or password" };
    }
  } catch (error) {
    console.error("Login failed:", error);
    return { success: false, message: "An error occurred during login" };
  }
};

// Register a new user
const registerUser = async (newUser) => {
  try {
    const data = await fetchData();
    const userExists = data.users.some((u) => u.email === newUser.email);

    if (userExists) {
      console.error("User already exists");
      return { success: false, message: "User already exists" };
    }

    // Add the new user to the users array
    newUser.logs = { workouts: [], nutrition: [], progress: [] }; // Initialize logs
    data.users.push(newUser);

    // Simulate saving the updated data
    await writeUserData(data);
    console.log("Registration successful. User added:", newUser);
    return { success: true };
  } catch (error) {
    console.error("Registration failed:", error);
    return { success: false, message: "An error occurred during registration" };
  }
};

// Get the logged-in user from localStorage
const getLoggedInUser = async () => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.log("No user is logged in");
      return null;
    }

    const email = atob(token); // Decode the token to get the email
    const data = await fetchData();
    const user = data.users.find((u) => u.email === email);

    if (user) {
      console.log("Logged-in user found:", user);
      return user;
    } else {
      console.error("No matching user found for token");
      return null;
    }
  } catch (error) {
    console.error("Error fetching logged-in user:", error);
    return null;
  }
};

// Export all functions
export { 
  fetchData, 
  writeUserData, 
  logUserData, 
  loginUser, 
  registerUser, 
  getLoggedInUser, 
  updateUserLogs 
};
