import React from "react";

const Footer = () => {
  return (
    <footer className="bg-black text-red-500 text-center py-6 border-t border-gray-700">
      <div className="container mx-auto px-4">
        <p className="text-sm">
          © {new Date().getFullYear()} <span className="font-bold">Fitness Tracker</span>. All rights reserved.
        </p>
        <div className="mt-2">
          <a
            href="/privacy"
            className="text-gray-400 hover:text-red-500 transition duration-300 mx-2"
          >
            Privacy Policy
          </a>
          <a
            href="/terms"
            className="text-gray-400 hover:text-red-500 transition duration-300 mx-2"
          >
            Terms of Service
          </a>
          <a
            href="/contact"
            className="text-gray-400 hover:text-red-500 transition duration-300 mx-2"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
