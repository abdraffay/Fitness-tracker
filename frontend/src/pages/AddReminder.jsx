import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddReminder = () => {

  const getUserIdFromToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
      return payload.id;
    } catch (error) {
      console.error("Invalid token format:", error);
      return null;
    }
  };
  const token = localStorage.getItem("token");


  const [formData, setFormData] = useState({
    userId: getUserIdFromToken(token), 
    time: "", // Time in minutes
    message: "",
    type: "",
  });


  
  const handleToast = (message, toastType) => {
    toastType === "danger" ? toast.error(message) : toast.success(message);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/setReminder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();

      if (responseData.message) {
        handleToast(responseData.message, "success");
      } else {
        handleToast(responseData.error, "danger");
      }
    } catch (err) {
      handleToast("Something went wrong!", "danger");
    }
  };

  return (
    <div className="p-6 bg-black text-white min-h-screen flex items-center justify-center">
      <div className="bg-card p-8 rounded shadow-lg w-full max-w-md animate-fadeIn">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-3xl font-bold text-center mb-6">Set a Reminder</h2>
          <input
            type="number"
            id="time"
            name="time"
            placeholder="Time (in minutes)"
            value={formData.time}
            onChange={handleChange}
            className="w-full p-3 bg-black rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
          <textarea
            id="message"
            name="message"
            placeholder="Message"
            value={formData.message}
            onChange={handleChange}
            className="w-full p-3 bg-black rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          ></textarea>
         

               <select
                  className="w-full p-3 bg-black text-white rounded focus:outline-none focus:ring-2 focus:ring-secondary"
                  value={''}
                  id="type"
                  name="type"
                  onChange={handleChange}
                >
                  <option>Reminder Type</option>
                    <option value={'workout'}>workout</option>
                    <option value={'meal'}>Meal</option>
                </select>


          <button
            type="submit"
            className="w-full bg-red-600 py-2 rounded text-white hover:bg-red-700 transition"
          >
            Set Reminder
          </button>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default AddReminder;
