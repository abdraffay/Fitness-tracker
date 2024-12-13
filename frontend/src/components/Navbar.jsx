import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

   // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Check if user is logged in
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  return (
    <nav className="bg-card text-textPrimary p-4 shadow-md">
      <div className="flex justify-between items-center">
        {/* Logo or App Title */}
        <h1 className="text-2xl font-bold text-primary-light transition-transform transform hover:scale-105 duration-300">
          Fitness Tracker
        </h1>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex space-x-6">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive
                ? "text-secondary font-bold border-b-2 border-secondary"
                : "hover:text-secondary transition-all"
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/workouts"
            className={({ isActive }) =>
              isActive
                ? "text-secondary font-bold border-b-2 border-secondary"
                : "hover:text-secondary transition-all"
            }
          >
            Workouts
          </NavLink>
          <NavLink
            to="/nutrition"
            className={({ isActive }) =>
              isActive
                ? "text-secondary font-bold border-b-2 border-secondary"
                : "hover:text-secondary transition-all"
            }
          >
            Nutrition
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              isActive
                ? "text-secondary font-bold border-b-2 border-secondary"
                : "hover:text-secondary transition-all"
            }
          >
            Profile
          </NavLink>
          <NavLink
            to="/bmi-calculator"
            className={({ isActive }) =>
              isActive
                ? "text-secondary font-bold border-b-2 border-secondary"
                : "hover:text-secondary transition-all"
            }
          >
            BMI Calculator
          </NavLink>
          <NavLink
            to="/progress"
            className={({ isActive }) =>
              isActive
                ? "block text-secondary font-bold"
                : "block hover:text-secondary transition-all"
            }
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Progress
          </NavLink>
          <NavLink
            to="/addReminder"
            className={({ isActive }) =>
              isActive
                ? "block text-secondary font-bold"
                : "block hover:text-secondary transition-all"
            }
            onClick={() => setIsMobileMenuOpen(false)}
          >
          Add Reminder
          </NavLink>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-primary-light hover:text-secondary transition-all"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>

        {/* Logout Button */}
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="hidden md:block bg-secondary text-white py-2 px-4 rounded-lg shadow-lg hover:bg-red-700 transition-all duration-300"
          >
            Logout
          </button>
        ) : (
          <NavLink
            to="/login"
            className="hidden md:block bg-secondary text-white py-2 px-4 rounded-lg shadow-lg hover:bg-red-700 transition-all duration-300"
          >
            Login
          </NavLink>
        )}
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="mt-4 space-y-4 md:hidden">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive
                ? "block text-secondary font-bold"
                : "block hover:text-secondary transition-all"
            }
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/workouts"
            className={({ isActive }) =>
              isActive
                ? "block text-secondary font-bold"
                : "block hover:text-secondary transition-all"
            }
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Workouts
          </NavLink>
          <NavLink
            to="/nutrition"
            className={({ isActive }) =>
              isActive
                ? "block text-secondary font-bold"
                : "block hover:text-secondary transition-all"
            }
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Nutrition
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              isActive
                ? "block text-secondary font-bold"
                : "block hover:text-secondary transition-all"
            }
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Profile
          </NavLink>
          <NavLink
            to="/bmi-calculator"
            className={({ isActive }) =>
              isActive
                ? "block text-secondary font-bold"
                : "block hover:text-secondary transition-all"
            }
            onClick={() => setIsMobileMenuOpen(false)}
          >
            BMI Calculator
          </NavLink>
          <NavLink
            to="/progress"
            className={({ isActive }) =>
              isActive
                ? "block text-secondary font-bold"
                : "block hover:text-secondary transition-all"
            }
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Progress
          </NavLink>
          {isLoggedIn && (
            <button
              onClick={handleLogout}
              className="w-full bg-secondary text-white py-2 rounded-lg hover:bg-red-700 transition-all"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
