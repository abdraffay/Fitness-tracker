const express = require("express");
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv").config();
const { connectionDB } = require("./Config/ConnectDB");
const authMiddleware = require("./Middlewares/authMiddleware"); // Path to the auth middleware
const jwt = require("jsonwebtoken");
// Initialize Express and HTTP server
const app = express();
const server = http.createServer(app);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:3000", // Replace with your frontend URL
    credentials: true,
  })
);



// Socket.IO Setup
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000", // Replace with your frontend URL
    methods: ["GET", "POST"],
  },
});
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  console.log("Token received:", token);
  if (!token) {
    return next(new Error("Authentication error: Token missing"));
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    console.log("Decoded token:", decoded);
    socket.user = decoded;
    next();
  } catch (err) {
    console.error("Token verification failed:", err.message);
    next(new Error("Authentication error"));
  }
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error("Authentication error"));
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    socket.user = decoded;
    next();
  } catch (err) {
    next(new Error("Authentication error"));
  }
});


// Controllers and Routes
const { ImageLayer } = require("./Middlewares/ImageUpload");
const upload = ImageLayer();

// Authentication Controllers
const {
  UserRegister,
  UserLogin,
  UserGet,
  updateProfile,
} = require("./Controllers/Auth");

// Workout Controllers
const {
  addWorkout,
  getAllWorkouts,
  getUserWorkouts,
  getWorkoutById,
  updateWorkout,
  deleteWorkout,
  getExercises
} = require("./Controllers/WorkoutController");

// FoodItem Controllers
const { AddFood, UpdateFood, GetFood, DeleteFood } = require("./Controllers/FoodItems");

// Nutrition Tracking Controllers
const {
  AddNutritionTracking,
  UpdateNutritionTracking,
  DeleteNutritionTracking,
  GetNutritionTrackingByUser,
} = require("./Controllers/NutritionTracker");

const { setReminder, getReminders } = require("./Controllers/Reminder");

// Authentication Routes
app.route("/register").post(upload.single("userImage"), UserRegister);
app.route("/login").post(UserLogin);
app.route("/user/:id").get(UserGet).put(updateProfile);

// Workout Routes (Protected)
app.route("/workout").post(authMiddleware, addWorkout).get(authMiddleware, getAllWorkouts);
app
  .route("/workout/:id")
  .get(authMiddleware, getWorkoutById)
  .put(authMiddleware, updateWorkout)
  .delete(authMiddleware, deleteWorkout);
app.route("/userWorkout/:userId").get(authMiddleware, getUserWorkouts);
app.route("/exercises").get(getExercises)

// Nutrition Tracking Routes (Protected)
app
  .route("/nutritionTracking")
  .post(authMiddleware, AddNutritionTracking);
app
  .route("/nutritionTracking/:id")
  .put(authMiddleware, UpdateNutritionTracking)
  .delete(authMiddleware, DeleteNutritionTracking);
app
  .route("/nutritionTracking/:userId")
  .get(authMiddleware, GetNutritionTrackingByUser);

  // Food Item Routes
app.route("/fooditem").post(AddFood).get(GetFood);
app.route("/fooditem/:id").put(UpdateFood).delete(DeleteFood);


// Reminder Routes
app.route("/setReminder").post(setReminder);
app.route("/getReminders/:userId").get(getReminders);

// Start Server
server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
  connectionDB();
});
