import React from "react";
import { motion } from "framer-motion";

const Loader = () => {
  return (
    <motion.div
      className="flex items-center justify-center h-screen bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex items-center space-x-2">
        <div className="w-5 h-5 bg-secondary rounded-full animate-bounce"></div>
        <div className="w-5 h-5 bg-primary rounded-full animate-bounce"></div>
        <div className="w-5 h-5 bg-secondary rounded-full animate-bounce"></div>
      </div>
    </motion.div>
  );
};

export default Loader;
