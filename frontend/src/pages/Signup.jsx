import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
  const navigate = useNavigate();

  // Signup Form State
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userImage, setUserImage] = useState(null);

  const handleToast = (message, toastType) => {
    toastType === "danger" ? toast.error(message) : toast.success(message);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("userName", userName);
    formData.append("userEmail", userEmail);
    formData.append("userPassword", userPassword);
    formData.append("userImage", userImage);

    try {
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        body: formData,
      });

      const responseData = await response.json();

      if (responseData.message) {
        handleToast(responseData.message, "success");
         console.log(response)
        // Delay navigation by 2 seconds
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        handleToast(responseData.error, "danger");
      }
    } catch (error) {
      handleToast("Registration failed", "danger");
    }
  };

  return (
    <div className="p-6 bg-black text-white min-h-screen flex items-center justify-center">
      <div className="bg-gray-900 p-8 rounded shadow-lg w-full max-w-md animate-fadeIn">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-3xl font-bold text-center mb-6">Sign Up</h2>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={userName || ""}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full p-3 bg-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={userEmail || ""}
            onChange={(e) => setUserEmail(e.target.value)}
            className="w-full p-3 bg-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={userPassword || ""}
            onChange={(e) => setUserPassword(e.target.value)}
            className="w-full p-3 bg-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={(e) => setUserImage(e.target.files[0])}
            className="w-full p-3 bg-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <button
            type="submit"
            className="w-full bg-red-600 py-2 rounded text-white hover:bg-red-700 transition"
          >
            Sign Up
          </button>
          <div className="text-center mt-4">
            <p className="text-sm text-gray-400">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-red-500 underline hover:text-red-600"
              >
                Login
              </button>
            </p>
          </div>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Signup;
