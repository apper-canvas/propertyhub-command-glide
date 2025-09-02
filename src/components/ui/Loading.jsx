import React from "react";
import { motion } from "framer-motion";

const Loading = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header skeleton */}
      <div className="text-center mb-12">
        <div className="animate-pulse">
          <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg mx-auto mb-4 w-96"></div>
          <div className="h-6 bg-gray-200 rounded-lg mx-auto mb-8 w-128"></div>
          <div className="h-12 bg-gray-200 rounded-lg mx-auto w-128"></div>
        </div>
      </div>

      {/* Property grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-card overflow-hidden"
          >
            <div className="animate-pulse">
              {/* Image skeleton */}
              <div className="h-48 bg-gradient-to-r from-gray-200 to-gray-300"></div>
              
              <div className="p-4 space-y-3">
                {/* Title skeleton */}
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                
                {/* Price skeleton */}
                <div className="h-8 bg-gradient-to-r from-primary/20 to-accent/20 rounded w-1/2"></div>
                
                {/* Address skeleton */}
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                
                {/* Property details skeleton */}
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Loading indicator */}
      <div className="flex items-center justify-center mt-12">
        <div className="flex items-center space-x-3 text-gray-500">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
          <span className="text-lg font-medium">Loading amazing properties...</span>
        </div>
      </div>
    </div>
  );
};

export default Loading;