import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { savedService } from "@/services/api/savedService";
import { formatDate } from "@/utils/formatters";
import { toast } from "react-toastify";

const SavedSearchesPage = () => {
  const [savedSearches, setSavedSearches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadSavedSearches();
  }, []);

  const loadSavedSearches = async () => {
    setLoading(true);
    setError("");
    
    try {
      const searches = await savedService.getSavedSearches();
      setSavedSearches(searches);
    } catch (err) {
      setError("Failed to load saved searches. Please try again.");
      console.error("Error loading saved searches:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSearch = async (searchId) => {
    if (window.confirm("Are you sure you want to delete this saved search?")) {
      try {
        await savedService.deleteSearch(searchId);
        setSavedSearches(prev => prev.filter(s => s.Id !== searchId));
        toast.success("Saved search deleted successfully");
      } catch (err) {
        toast.error("Failed to delete saved search");
        console.error("Error deleting search:", err);
      }
    }
  };

  const handleRunSearch = (search) => {
    // Convert saved search filters to URL parameters
    const searchParams = new URLSearchParams();
    
    Object.entries(search.filters).forEach(([key, value]) => {
      if (Array.isArray(value) && value.length > 0) {
        searchParams.set(key, value.join(","));
      } else if (value !== "" && value !== null && value !== undefined) {
        searchParams.set(key, value);
      }
    });
    
    navigate(`/?${searchParams.toString()}`);
  };

  const getFilterSummary = (filters) => {
    const summary = [];
    
    if (filters.query) {
      summary.push(`"${filters.query}"`);
    }
    
    if (filters.priceMin || filters.priceMax) {
      const priceRange = [];
      if (filters.priceMin) priceRange.push(`$${parseInt(filters.priceMin).toLocaleString()}+`);
      if (filters.priceMax) priceRange.push(`under $${parseInt(filters.priceMax).toLocaleString()}`);
      summary.push(priceRange.join(" to "));
    }
    
    if (filters.propertyTypes && filters.propertyTypes.length > 0) {
      summary.push(filters.propertyTypes.join(", "));
    }
    
    if (filters.bedroomsMin) {
      summary.push(`${filters.bedroomsMin}+ bedrooms`);
    }
    
    if (filters.bathroomsMin) {
      summary.push(`${filters.bathroomsMin}+ bathrooms`);
    }
    
    if (filters.squareFeetMin) {
      summary.push(`${parseInt(filters.squareFeetMin).toLocaleString()}+ sqft`);
    }
    
    if (filters.amenities && filters.amenities.length > 0) {
      summary.push(`${filters.amenities.length} amenities`);
    }
    
    return summary.slice(0, 3).join(" • ");
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadSavedSearches} />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
          Saved Searches
        </h1>
        <p className="text-gray-600">
          {savedSearches.length} saved search{savedSearches.length !== 1 ? "es" : ""} ready to run
        </p>
      </motion.div>

      {/* Saved Searches List */}
      {savedSearches.length === 0 ? (
        <Empty
          icon="Search"
          title="No Saved Searches"
          message="Save your search criteria to quickly find similar properties in the future."
          actionText="Start Searching"
          onAction={() => navigate("/")}
        />
      ) : (
        <div className="space-y-4">
          {savedSearches.map((search, index) => (
            <motion.div
              key={search.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-card hover:shadow-card-hover transition-shadow p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-display font-semibold text-gray-900 truncate">
                      {search.name}
                    </h3>
                    <Badge variant="primary" className="text-xs">
                      {search.resultCount || 0} results
                    </Badge>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-3">
                    {getFilterSummary(search.filters) || "All properties"}
                  </p>
                  
                  <div className="flex items-center text-xs text-gray-500 space-x-4">
                    <div className="flex items-center">
                      <ApperIcon name="Calendar" className="w-4 h-4 mr-1" />
                      <span>Saved {formatDate(search.createdAt)}</span>
                    </div>
                    <div className="flex items-center">
                      <ApperIcon name="RefreshCw" className="w-4 h-4 mr-1" />
                      <span>Last run: Today</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRunSearch(search)}
                    className="flex items-center space-x-2"
                  >
                    <ApperIcon name="Play" className="w-4 h-4" />
                    <span>Run Search</span>
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteSearch(search.Id)}
                    className="text-error hover:bg-error/10"
                  >
                    <ApperIcon name="Trash2" className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              {/* Search Filters Detail */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  {search.filters.priceMin && (
                    <div>
                      <span className="text-gray-500">Min Price:</span>
                      <span className="ml-2 font-medium">${parseInt(search.filters.priceMin).toLocaleString()}</span>
                    </div>
                  )}
                  
                  {search.filters.priceMax && (
                    <div>
                      <span className="text-gray-500">Max Price:</span>
                      <span className="ml-2 font-medium">${parseInt(search.filters.priceMax).toLocaleString()}</span>
                    </div>
                  )}
                  
                  {search.filters.bedroomsMin && (
                    <div>
                      <span className="text-gray-500">Min Bedrooms:</span>
                      <span className="ml-2 font-medium">{search.filters.bedroomsMin}+</span>
                    </div>
                  )}
                  
                  {search.filters.bathroomsMin && (
                    <div>
                      <span className="text-gray-500">Min Bathrooms:</span>
                      <span className="ml-2 font-medium">{search.filters.bathroomsMin}+</span>
                    </div>
                  )}
                  
                  {search.filters.propertyTypes && search.filters.propertyTypes.length > 0 && (
                    <div className="col-span-2">
                      <span className="text-gray-500">Property Types:</span>
                      <span className="ml-2 font-medium">{search.filters.propertyTypes.join(", ")}</span>
                    </div>
                  )}
                  
                  {search.filters.amenities && search.filters.amenities.length > 0 && (
                    <div className="col-span-2">
                      <span className="text-gray-500">Amenities:</span>
                      <span className="ml-2 font-medium">{search.filters.amenities.join(", ")}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Tips Section */}
      {savedSearches.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg p-6"
        >
          <h2 className="text-xl font-display font-semibold text-gray-900 mb-4">
            Making the Most of Saved Searches
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <ApperIcon name="Bell" className="w-3 h-3 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Smart Alerts</h3>
                <p>Get notified when new properties match your saved search criteria.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <ApperIcon name="RefreshCw" className="w-3 h-3 text-accent" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Regular Updates</h3>
                <p>Run your saved searches weekly to discover newly listed properties.</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SavedSearchesPage;