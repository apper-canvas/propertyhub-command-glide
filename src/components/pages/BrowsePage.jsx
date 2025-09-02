import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import SearchBar from "@/components/molecules/SearchBar";
import FilterPanel from "@/components/molecules/FilterPanel";
import PropertyGrid from "@/components/organisms/PropertyGrid";
import PropertyCard from "@/components/molecules/PropertyCard";
import Loading from "@/components/ui/Loading";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import { propertyService } from "@/services/api/propertyService";
import { savedService } from "@/services/api/savedService";
import { toast } from "react-toastify";
const BrowsePage = () => {
  const [filters, setFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [savedProperties, setSavedProperties] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);

  useEffect(() => {
    loadFeaturedProperties();
    loadSavedProperties();
  }, []);

  const loadFeaturedProperties = async () => {
    try {
      const data = await propertyService.getFeatured();
      setFeaturedProperties(data);
    } catch (err) {
      console.error("Error loading featured properties:", err);
    } finally {
      setLoadingFeatured(false);
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
const handleSearch = useCallback((query) => {
    if (query?.trim()) {
      setFilters(prev => ({ ...prev, query: query.trim() }));
    } else {
      setFilters(prev => {
        const { query, ...rest } = prev;
        return rest;
      });
    }
  }, []);

  const handleApplyFilters = useCallback((newFilters) => {
    setFilters(newFilters || {});
  }, []);

const handleSaveProperty = useCallback(async (propertyId) => {
    if (!propertyId) return;
    
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
  }, [savedProperties]);

  const getActiveFiltersCount = () => {
    return Object.keys(filters).length;
  };

  const clearFilters = () => {
    setFilters({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
          Find Your Perfect <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Home</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Discover amazing properties in your ideal location with our comprehensive search and filtering tools.
        </p>
        
        <SearchBar 
          onSearch={handleSearch} 
          className="max-w-2xl mx-auto"
        />
      </motion.div>

      {/* Featured Properties */}
      {!Object.keys(filters).length && (
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-display font-bold text-gray-900">
              Featured Properties
            </h2>
            <Badge variant="accent" className="px-3 py-1">
              <ApperIcon name="Star" className="w-4 h-4 mr-1" />
              Handpicked
            </Badge>
          </div>
          
          {loadingFeatured ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                  <div className="space-y-2">
                    <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                    <div className="bg-gray-200 h-6 rounded w-1/2"></div>
                    <div className="bg-gray-200 h-4 rounded w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProperties.map((property, index) => (
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
            </div>
          )}
        </motion.section>
      )}

      {/* Search Results Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: Object.keys(filters).length ? 0 : 0.4 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-display font-bold text-gray-900">
            {Object.keys(filters).length ? "Search Results" : "All Properties"}
          </h2>
          
          <div className="flex items-center space-x-3">
            {/* Active filters */}
            {getActiveFiltersCount() > 0 && (
              <div className="flex items-center space-x-2">
                <Badge variant="primary" className="px-3 py-1">
                  {getActiveFiltersCount()} filter{getActiveFiltersCount() !== 1 ? "s" : ""} active
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="text-xs"
                >
                  Clear All
                </Button>
              </div>
            )}

            {/* View mode toggle */}
            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "grid"
                    ? "bg-white text-primary shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <ApperIcon name="Grid3X3" className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "list"
                    ? "bg-white text-primary shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <ApperIcon name="List" className="w-4 h-4" />
              </button>
            </div>

            {/* Filter button */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(true)}
              className="flex items-center space-x-2"
            >
              <ApperIcon name="SlidersHorizontal" className="w-4 h-4" />
              <span>Filters</span>
            </Button>
          </div>
        </div>

        <PropertyGrid
          filters={filters}
          viewMode={viewMode}
        />
      </motion.section>

      {/* Filter Panel */}
      <FilterPanel
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        onApplyFilters={handleApplyFilters}
        initialFilters={filters}
      />
    </div>
  );
};

export default BrowsePage;