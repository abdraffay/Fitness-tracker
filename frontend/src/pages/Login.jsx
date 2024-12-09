import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const navigate = useNavigate();

  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleToast = (message, toastType) => {
    toastType === "danger" ? toast.error(message) : toast.success(message);
  };

  // Handle login logic
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!userEmail || !userPassword) {
      handleToast("Please enter both email and password.", "danger");
      return;
    }

    const loginData = { userEmail, userPassword };

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      const responseData = await response.json();

      if (response.ok) {
        console.log("Response Data:", responseData);
        localStorage.setItem("token", responseData.token);
        console.log("Token Stored:", localStorage.getItem("token"));
        handleToast("Login successful", "success");
        navigate("/dashboard"); // Navigate to the dashboard
      } else {
        handleToast(responseData.error, "danger");
      }
    } catch (error) {
      console.error("Error during login:", error.message);
      handleToast("Login failed", "danger");
    }
  };

  // Handle "Enter" key for form submission
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLogin(e);
    }
  };

  return (
    <div className="p-6 bg-black text-white min-h-screen flex items-center justify-center">
      <div className="bg-gray-900 p-8 rounded shadow-lg w-full max-w-md animate-fadeIn">
        <h2 className="text-3xl font-bold text-center mb-6">Welcome Back</h2>
        <div className="space-y-6">
          {/* Email Input */}
          <input
            type="email"
            placeholder="Email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            className="w-full p-3 bg-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            autoComplete="email"
            required
          />

          {/* Password Input with Toggle */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full p-3 bg-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-red-500 focus:outline-none"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            className={`w-full p-3 rounded text-white transition-transform transform ${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700 hover:scale-105"
            }`}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* Redirect to Signup */}
          <div className="text-center mt-4">
            <p className="text-sm text-gray-400">
              Don't have an account?{" "}
              <button
                onClick={() => navigate("/signup")}
                className="text-red-500 underline hover:text-red-600"
              >
                Sign Up
              </button>
            </p>
          </div>

          <ToastContainer />
        </div>
      </div>
    </div>
  );
};

export default Login;
