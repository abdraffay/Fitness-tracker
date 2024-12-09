import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Loader from "./components/Loader";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Lazy-loaded pages
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Workouts = lazy(() => import("./pages/Workouts"));
const Nutrition = lazy(() => import("./pages/Nutrition"));
const Profile = lazy(() => import("./pages/Profile"));
const BMICalculator = lazy(() => import("./pages/BMICalculator"));
const ProgressPage = lazy(() => import("./pages/ProgressPage")); // New Progress Page

// Authentication and Layout Handling
function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem("token");
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function ProtectedLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow p-6">{children}</main>
      <Footer />
    </div>
  );
}

// Main App Component
function App() {
  return (
    <Router>
      <Suspense fallback={<Loader />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <ProtectedLayout>
                  <Dashboard />
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/workouts"
            element={
              <ProtectedRoute>
                <ProtectedLayout>
                  <Workouts />
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/nutrition"
            element={
              <ProtectedRoute>
                <ProtectedLayout>
                  <Nutrition />
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProtectedLayout>
                  <Profile />
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/bmi-calculator"
            element={
              <ProtectedRoute>
                <ProtectedLayout>
                  <BMICalculator />
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/progress"
            element={
              <ProtectedRoute>
                <ProtectedLayout>
                  <ProgressPage />
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />

          {/* Redirect unknown routes */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Suspense>
      <ToastContainer />
    </Router>
  );
}

export default App;
