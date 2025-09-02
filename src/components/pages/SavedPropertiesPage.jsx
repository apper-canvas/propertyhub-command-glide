import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PropertyCard from "@/components/molecules/PropertyCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { propertyService } from "@/services/api/propertyService";
import { savedService } from "@/services/api/savedService";
import { toast } from "react-toastify";

const SavedPropertiesPage = () => {
  const [savedPropertyIds, setSavedPropertyIds] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadSavedProperties();
  }, []);

  const loadSavedProperties = async () => {
    setLoading(true);
    setError("");
    
    try {
      const savedIds = await savedService.getSavedProperties();
      setSavedPropertyIds(savedIds);
      
      if (savedIds.length > 0) {
        const allProperties = await propertyService.getAll();
        const savedProps = allProperties.filter(p => savedIds.includes(p.Id));
        setProperties(savedProps);
      } else {
        setProperties([]);
      }
    } catch (err) {
      setError("Failed to load saved properties. Please try again.");
      console.error("Error loading saved properties:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUnsaveProperty = async (propertyId) => {
    try {
      await savedService.unsaveProperty(propertyId);
      setSavedPropertyIds(prev => prev.filter(id => id !== propertyId));
      setProperties(prev => prev.filter(p => p.Id !== propertyId));
      toast.success("Property removed from saved list");
    } catch (err) {
      toast.error("Failed to remove property from saved list");
      console.error("Error unsaving property:", err);
    }
  };

  const handleClearAll = async () => {
    if (window.confirm("Are you sure you want to remove all saved properties?")) {
      try {
        for (const propertyId of savedPropertyIds) {
          await savedService.unsaveProperty(propertyId);
        }
        setSavedPropertyIds([]);
        setProperties([]);
        toast.success("All saved properties have been removed");
      } catch (err) {
        toast.error("Failed to clear saved properties");
        console.error("Error clearing saved properties:", err);
      }
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadSavedProperties} />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
              Saved Properties
            </h1>
            <p className="text-gray-600">
              {properties.length} propert{properties.length !== 1 ? "ies" : "y"} saved for later viewing
            </p>
          </div>
          
          {properties.length > 0 && (
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={handleClearAll}
                className="flex items-center space-x-2 text-error border-error hover:bg-error hover:text-white"
              >
                <ApperIcon name="Trash2" className="w-4 h-4" />
                <span>Clear All</span>
              </Button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Properties Grid */}
      {properties.length === 0 ? (
        <Empty
          icon="Heart"
          title="No Saved Properties"
          message="Start exploring properties and save your favorites to see them here."
          actionText="Browse Properties"
          onAction={() => window.location.href = "/"}
        />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {properties.map((property, index) => (
            <motion.div
              key={property.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <PropertyCard
                property={property}
                onSave={handleUnsaveProperty}
                isSaved={true}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Tips Section */}
      {properties.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg p-6"
        >
          <h2 className="text-xl font-display font-semibold text-gray-900 mb-4">
            Managing Your Saved Properties
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <ApperIcon name="Heart" className="w-3 h-3 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Quick Access</h3>
                <p>Your saved properties are always accessible from any page via the navigation menu.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <ApperIcon name="Bell" className="w-3 h-3 text-accent" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Stay Updated</h3>
                <p>We'll notify you of price changes and new similar properties in your preferred areas.</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SavedPropertiesPage;