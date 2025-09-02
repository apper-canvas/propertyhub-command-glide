import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  icon = "Home",
  title = "No items found",
  message = "There are no items to display at the moment.",
  actionText = "Get Started",
  onAction
}) => {
  return (
    <div className="w-full max-w-md mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 }}
          className="w-20 h-20 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <ApperIcon name={icon} className="w-10 h-10 text-primary" />
        </motion.div>

        <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">
          {title}
        </h2>
        
        <p className="text-gray-600 mb-8 leading-relaxed">
          {message}
        </p>

        {onAction && (
          <Button onClick={onAction} className="mx-auto">
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            {actionText}
          </Button>
        )}

        <div className="mt-8 grid grid-cols-2 gap-4 text-sm text-gray-600">
          <div className="flex items-center justify-center p-3 bg-gray-50 rounded-lg">
            <ApperIcon name="Search" className="w-4 h-4 mr-2 text-primary" />
            <span>Browse Properties</span>
          </div>
          <div className="flex items-center justify-center p-3 bg-gray-50 rounded-lg">
            <ApperIcon name="Filter" className="w-4 h-4 mr-2 text-accent" />
            <span>Use Filters</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Empty;