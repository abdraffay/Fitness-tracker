import React, { useState, useEffect } from "react";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }

    const fetchProfile = async () => {
      try {
        // Call your API to get the user profile
        const response = await fetch(
          `http://localhost:5000/user/${getUserIdFromToken(token)}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Include token in Authorization header
            },
          }
        );

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          console.error("Failed to fetch user profile.");
          navigate("/login");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, navigate]);

  const getUserIdFromToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
      return payload.id;
    } catch (error) {
      console.error("Invalid token format:", error);
      return null;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <Loader />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-black">
        <p className="text-center text-red-500 text-xl font-semibold">
          No profile available. Please log in.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-black text-white flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-6 animate-fadeIn">Profile</h2>
      <div className="space-y-6 w-full max-w-2xl">
        {/* Profile Header */}
        <div className="bg-gray-900 p-6 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105">
          <div className="flex items-center mb-4">
            {/* Profile Picture */}
            <div className="w-20 h-20 rounded-full flex justify-center items-center text-white text-3xl font-bold shadow-md mr-4 overflow-hidden bg-gray-700">
              {user.userImage ? (
                <img
                  src={user.userImage}
                  alt={`${user.userName}'s profile`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>
                  {user.userName ? user.userName[0].toUpperCase() : "U"}
                </span>
              )}
            </div>

            <div>
              <h3 className="text-2xl font-extrabold">
              {user.userName ? user.userName.toUpperCase() : "U"}
              </h3>
              <p className="text-gray-400">{user.userEmail}</p>
            </div>
          </div>
        </div>

        {/* Activity Logs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-red-900 p-6 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105">
            <h3 className="text-lg font-bold text-red-400 flex items-center">
              <span className="mr-2">🏋️‍♂️</span> Workouts Logged
            </h3>
            <p className="text-3xl font-semibold text-white">
              {user.logs?.workouts?.length || 0}
            </p>
          </div>
          <div className="bg-red-900 p-6 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105">
            <h3 className="text-lg font-bold text-red-400 flex items-center">
              <span className="mr-2">🥗</span> Nutrition Logs
            </h3>
            <p className="text-3xl font-semibold text-white">
              {user.logs?.nutrition?.length || 0}
            </p>
          </div>
          <div className="bg-red-900 p-6 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105">
            <h3 className="text-lg font-bold text-red-400 flex items-center">
              <span className="mr-2">📈</span> Progress Entries
            </h3>
            <p className="text-3xl font-semibold text-white">
              {user.logs?.progress?.length || 0}
            </p>
          </div>
        </div>

        {/* Personal Info */}
        <div className="bg-gray-900 p-6 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105">
          <h3 className="text-lg font-bold text-red-400 mb-4">Personal Info</h3>
          <div className="space-y-2 text-gray-300">
            <p>
              <strong>Name:</strong> {user.userName || "N/A"}
            </p>
            <p>
              <strong>Email:</strong> {user.userEmail}
            </p>
            {/* <p>
              <strong>Joined On:</strong>{" "}
              {new Date(user.createdAt).toLocaleDateString() || "N/A"}
            </p> */}
          </div>
        </div>

        {/* Profile Actions */}
        <div className="flex justify-end">
          <button className="bg-red-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-red-700 transition-transform transform hover:scale-105">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;