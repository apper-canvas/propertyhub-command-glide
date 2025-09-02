import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Label from "@/components/atoms/Label";
import { cn } from "@/utils/cn";

const FilterPanel = ({ isOpen, onClose, onApplyFilters, initialFilters = {} }) => {
  const [filters, setFilters] = useState({
    priceMin: "",
    priceMax: "",
    propertyTypes: [],
    bedroomsMin: "",
    bathroomsMin: "",
    squareFeetMin: "",
    amenities: [],
    ...initialFilters
  });

  const propertyTypes = [
    { value: "house", label: "House" },
    { value: "condo", label: "Condo" },
    { value: "townhouse", label: "Townhouse" },
    { value: "apartment", label: "Apartment" },
    { value: "land", label: "Land" },
    { value: "commercial", label: "Commercial" }
  ];

  const availableAmenities = [
    "Gym", "Pool", "Parking", "Pet Friendly", "Fireplace", 
    "Garden", "Rooftop Deck", "Concierge", "Elevator"
  ];

  const handleInputChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayToggle = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const handleApply = () => {
    const cleanFilters = Object.entries(filters).reduce((acc, [key, value]) => {
      if (value !== "" && (Array.isArray(value) ? value.length > 0 : true)) {
        acc[key] = value;
      }
      return acc;
    }, {});
    
    onApplyFilters(cleanFilters);
    onClose();
  };

  const handleClear = () => {
    const clearedFilters = {
      priceMin: "",
      priceMax: "",
      propertyTypes: [],
      bedroomsMin: "",
      bathroomsMin: "",
      squareFeetMin: "",
      amenities: []
    };
    setFilters(clearedFilters);
    onApplyFilters({});
  };

  const getActiveFiltersCount = () => {
    return Object.entries(filters).filter(([key, value]) => {
      if (Array.isArray(value)) return value.length > 0;
      return value !== "" && value !== null && value !== undefined;
    }).length;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed left-0 top-0 h-full w-80 bg-white shadow-2xl z-50 overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-semibold text-gray-900">
                  Filters {getActiveFiltersCount() > 0 && (
                    <span className="ml-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
                      {getActiveFiltersCount()}
                    </span>
                  )}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ApperIcon name="X" className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Price Range */}
                <div>
                  <Label>Price Range</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Input
                        type="number"
                        placeholder="Min price"
                        value={filters.priceMin}
                        onChange={(e) => handleInputChange("priceMin", e.target.value)}
                      />
                    </div>
                    <div>
                      <Input
                        type="number"
                        placeholder="Max price"
                        value={filters.priceMax}
                        onChange={(e) => handleInputChange("priceMax", e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Property Types */}
                <div>
                  <Label>Property Type</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {propertyTypes.map(type => (
                      <label
                        key={type.value}
                        className={cn(
                          "flex items-center p-3 border rounded-lg cursor-pointer transition-colors",
                          filters.propertyTypes.includes(type.value)
                            ? "border-primary bg-primary/5"
                            : "border-gray-200 hover:border-gray-300"
                        )}
                      >
                        <input
                          type="checkbox"
                          checked={filters.propertyTypes.includes(type.value)}
                          onChange={() => handleArrayToggle("propertyTypes", type.value)}
                          className="sr-only"
                        />
                        <span className="text-sm font-medium">{type.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Bedrooms and Bathrooms */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Min Bedrooms</Label>
                    <Select
                      value={filters.bedroomsMin}
                      onChange={(e) => handleInputChange("bedroomsMin", e.target.value)}
                    >
                      <option value="">Any</option>
                      <option value="1">1+</option>
                      <option value="2">2+</option>
                      <option value="3">3+</option>
                      <option value="4">4+</option>
                    </Select>
                  </div>
                  <div>
                    <Label>Min Bathrooms</Label>
                    <Select
                      value={filters.bathroomsMin}
                      onChange={(e) => handleInputChange("bathroomsMin", e.target.value)}
                    >
                      <option value="">Any</option>
                      <option value="1">1+</option>
                      <option value="2">2+</option>
                      <option value="3">3+</option>
                    </Select>
                  </div>
                </div>

                {/* Square Feet */}
                <div>
                  <Label>Minimum Square Feet</Label>
                  <Input
                    type="number"
                    placeholder="Min sqft"
                    value={filters.squareFeetMin}
                    onChange={(e) => handleInputChange("squareFeetMin", e.target.value)}
                  />
                </div>

                {/* Amenities */}
                <div>
                  <Label>Amenities</Label>
                  <div className="space-y-2">
                    {availableAmenities.map(amenity => (
                      <label
                        key={amenity}
                        className="flex items-center space-x-3 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={filters.amenities.includes(amenity)}
                          onChange={() => handleArrayToggle("amenities", amenity)}
                          className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2"
                        />
                        <span className="text-sm text-gray-700">{amenity}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 mt-8">
                <Button onClick={handleClear} variant="outline" className="flex-1">
                  Clear All
                </Button>
                <Button onClick={handleApply} className="flex-1">
                  Apply Filters
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FilterPanel;