import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { propertyService } from "@/services/api/propertyService";
import { savedService } from "@/services/api/savedService";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import PropertyCard from "@/components/molecules/PropertyCard";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import Select from "@/components/atoms/Select";

const PropertyGrid = ({ filters = {}, viewMode = "grid" }) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savedProperties, setSavedProperties] = useState([]);
  const [sortBy, setSortBy] = useState("newest");

useEffect(() => {
    loadProperties();
    loadSavedProperties();
  }, [filters]);

  const loadProperties = async () => {
    setLoading(true);
    setError("");
    
    try {
      let data;
      if (Object.keys(filters).length > 0) {
        data = await propertyService.search(filters);
      } else {
        data = await propertyService.getAll();
      }
      setProperties(data);
    } catch (err) {
      setError("Failed to load properties. Please try again.");
      console.error("Error loading properties:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadSavedProperties = async () => {
    try {
      const saved = await savedService.getSavedProperties();
      setSavedProperties(saved);
    } catch (err) {
      console.error("Error loading saved properties:", err);
    }
  };

// Use useMemo to prevent infinite loops - automatically recalculates when dependencies change
  const sortedProperties = useMemo(() => {
    if (!properties || properties.length === 0) return [];
    
    const sorted = [...properties];
    
    switch (sortBy) {
      case "price-low":
        sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "price-high":
        sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case "beds-high":
        sorted.sort((a, b) => (b.bedrooms || 0) - (a.bedrooms || 0));
        break;
      case "sqft-high":
        sorted.sort((a, b) => (b.squareFeet || 0) - (a.squareFeet || 0));
        break;
      case "newest":
      default:
        sorted.sort((a, b) => {
          const dateA = a.listingDate ? new Date(a.listingDate) : new Date(0);
          const dateB = b.listingDate ? new Date(b.listingDate) : new Date(0);
          return dateB - dateA;
        });
        break;
    }
    
    return sorted;
  }, [properties, sortBy]);

  const handleSaveProperty = async (propertyId) => {
    try {
      const isSaved = savedProperties.includes(propertyId);
      
      if (isSaved) {
        await savedService.unsaveProperty(propertyId);
        setSavedProperties(prev => prev.filter(id => id !== propertyId));
        toast.success("Property removed from saved list");
      } else {
        await savedService.saveProperty(propertyId);
        setSavedProperties(prev => [...prev, propertyId]);
        toast.success("Property saved successfully");
      }
    } catch (err) {
      toast.error("Failed to update saved properties");
      console.error("Error saving property:", err);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadProperties} />;
  if (properties.length === 0) {
    return (
      <Empty
        title="No Properties Found"
        message="Try adjusting your search filters to see more results."
        actionText="Clear Filters"
        onAction={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Results header */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {properties.length} propert{properties.length !== 1 ? "ies" : "y"} found
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-auto min-w-0"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="beds-high">Most Bedrooms</option>
              <option value="sqft-high">Largest First</option>
            </Select>
          </div>
        </div>
      </div>

      {/* Property grid/list */}
      <motion.div
        layout
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-6"
        }
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
              onSave={handleSaveProperty}
              isSaved={savedProperties.includes(property.Id)}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default PropertyGrid;