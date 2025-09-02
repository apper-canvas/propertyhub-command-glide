import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import SearchBar from "@/components/molecules/SearchBar";
import FilterPanel from "@/components/molecules/FilterPanel";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { propertyService } from "@/services/api/propertyService";
import { savedService } from "@/services/api/savedService";
import { formatPrice, formatSquareFeet, getPropertyTypeLabel } from "@/utils/formatters";
import { toast } from "react-toastify";

const MapViewPage = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [savedProperties, setSavedProperties] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.0060 });

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
      
      if (data.length > 0) {
        // Calculate center based on properties
        const avgLat = data.reduce((sum, p) => sum + p.coordinates.lat, 0) / data.length;
        const avgLng = data.reduce((sum, p) => sum + p.coordinates.lng, 0) / data.length;
        setMapCenter({ lat: avgLat, lng: avgLng });
      }
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

  const handleSearch = (query) => {
    if (query.trim()) {
      setFilters(prev => ({ ...prev, query: query.trim() }));
    } else {
      const { query, ...rest } = filters;
      setFilters(rest);
    }
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
  };

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

  const clearFilters = () => {
    setFilters({});
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadProperties} />;

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Property List Sidebar */}
      <div className="w-96 bg-white border-r border-gray-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <SearchBar onSearch={handleSearch} className="mb-4" />
          
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {properties.length} propert{properties.length !== 1 ? "ies" : "y"} found
            </div>
            
            <div className="flex items-center space-x-2">
              {Object.keys(filters).length > 0 && (
                <Badge variant="primary" className="text-xs">
                  {Object.keys(filters).length} active
                </Badge>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(true)}
              >
                <ApperIcon name="SlidersHorizontal" className="w-4 h-4" />
              </Button>
              {Object.keys(filters).length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-xs"
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Property List */}
        <div className="flex-1 overflow-y-auto">
          {properties.length === 0 ? (
            <div className="p-6 text-center">
              <ApperIcon name="MapPin" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Properties Found</h3>
              <p className="text-gray-500">Try adjusting your filters to see more results.</p>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {properties.map((property) => (
                <motion.div
                  key={property.Id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`bg-white border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                    selectedProperty?.Id === property.Id ? "border-primary shadow-md" : "border-gray-200"
                  }`}
                  onClick={() => setSelectedProperty(property)}
                >
                  <div className="flex space-x-3">
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-20 h-16 object-cover rounded-lg flex-shrink-0"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <div className="text-lg font-semibold text-primary">
                          {formatPrice(property.price)}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSaveProperty(property.Id);
                          }}
                          className={`p-1 rounded-full transition-colors ${
                            savedProperties.includes(property.Id)
                              ? "text-accent"
                              : "text-gray-400 hover:text-accent"
                          }`}
                        >
                          <ApperIcon 
                            name="Heart" 
                            className={`w-4 h-4 ${savedProperties.includes(property.Id) ? "fill-current" : ""}`} 
                          />
                        </button>
                      </div>
                      
                      <h3 className="font-medium text-gray-900 text-sm truncate mb-1">
                        {property.title}
                      </h3>
                      
                      <p className="text-xs text-gray-600 truncate mb-2">
                        {property.address}
                      </p>
                      
                      <div className="flex items-center space-x-3 text-xs text-gray-600">
                        <span>{property.bedrooms} bed</span>
                        <span>{property.bathrooms} bath</span>
                        <span>{formatSquareFeet(property.squareFeet)} sqft</span>
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        <Badge variant="primary" className="text-xs">
                          {getPropertyTypeLabel(property.propertyType)}
                        </Badge>
                        <Link
                          to={`/property/${property.Id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="text-xs text-primary hover:underline"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative bg-gray-100">
        {/* Mock Map with Property Markers */}
        <div className="w-full h-full relative overflow-hidden">
          {/* Map Background */}
          <div className="w-full h-full bg-gradient-to-br from-blue-50 to-green-50 relative">
            {/* Grid Pattern */}
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)',
                backgroundSize: '50px 50px'
              }}
            />
            
            {/* Property Markers */}
            {properties.map((property, index) => {
              const x = 20 + (index % 8) * 100 + Math.random() * 80;
              const y = 20 + Math.floor(index / 8) * 120 + Math.random() * 80;
              
              return (
                <motion.div
                  key={property.Id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer ${
                    selectedProperty?.Id === property.Id ? "z-20" : "z-10"
                  }`}
                  style={{ left: `${x}px`, top: `${y}px` }}
                  onClick={() => setSelectedProperty(property)}
                >
                  <div className={`relative ${
                    selectedProperty?.Id === property.Id ? "scale-110" : "hover:scale-105"
                  } transition-transform`}>
                    <div className={`px-3 py-2 bg-white border-2 rounded-lg shadow-lg ${
                      selectedProperty?.Id === property.Id 
                        ? "border-primary" 
                        : "border-gray-200"
                    }`}>
                      <div className="text-sm font-semibold text-primary">
                        {formatPrice(property.price)}
                      </div>
                    </div>
                    <div className={`absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 ${
                      selectedProperty?.Id === property.Id
                        ? "border-l-4 border-r-4 border-t-6 border-l-transparent border-r-transparent border-t-primary"
                        : "border-l-4 border-r-4 border-t-6 border-l-transparent border-r-transparent border-t-gray-200"
                    }`} />
                  </div>
                </motion.div>
              );
            })}

            {/* Map Controls */}
            <div className="absolute top-4 right-4 space-y-2">
              <Button variant="outline" className="bg-white">
                <ApperIcon name="Plus" className="w-4 h-4" />
              </Button>
              <Button variant="outline" className="bg-white">
                <ApperIcon name="Minus" className="w-4 h-4" />
              </Button>
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Map Legend</h4>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-4 h-4 bg-white border-2 border-primary rounded"></div>
                <span>Selected Property</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                <div className="w-4 h-4 bg-white border-2 border-gray-200 rounded"></div>
                <span>Available Properties</span>
              </div>
            </div>

            {/* Property Info Card */}
            {selectedProperty && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-4 right-4 bg-white rounded-lg shadow-xl p-4 max-w-sm"
              >
                <div className="flex space-x-3">
                  <img
                    src={selectedProperty.images[0]}
                    alt={selectedProperty.title}
                    className="w-16 h-12 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="text-lg font-semibold text-primary mb-1">
                      {formatPrice(selectedProperty.price)}
                    </div>
                    <h4 className="font-medium text-gray-900 text-sm truncate">
                      {selectedProperty.title}
                    </h4>
                    <p className="text-xs text-gray-600 truncate">
                      {selectedProperty.address}
                    </p>
                    <div className="flex items-center space-x-3 text-xs text-gray-600 mt-1">
                      <span>{selectedProperty.bedrooms} bed</span>
                      <span>{selectedProperty.bathrooms} bath</span>
                      <span>{formatSquareFeet(selectedProperty.squareFeet)} sqft</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2 mt-3">
                  <Link
                    to={`/property/${selectedProperty.Id}`}
                    className="flex-1"
                  >
                    <Button size="sm" className="w-full">
                      View Details
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedProperty(null)}
                  >
                    <ApperIcon name="X" className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

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

export default MapViewPage;