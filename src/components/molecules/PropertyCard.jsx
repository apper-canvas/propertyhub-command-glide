import React, { memo, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import { formatPrice, formatSquareFeet, getPropertyTypeLabel } from "@/utils/formatters";
const PropertyCard = memo(({ property, onSave, isSaved = false }) => {
  const handleSaveClick = useCallback((e) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (property?.Id && onSave) {
      onSave(property.Id);
    }
  }, [property?.Id, onSave]);

  if (!property) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="property-card bg-white rounded-lg shadow-card hover:shadow-card-hover overflow-hidden group"
    >
<Link to={`/property/${property.Id}`}>
        <div className="relative">
          <img
            src={property.images?.[0] || '/placeholder-property.jpg'}
            alt={property.title || 'Property image'}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = '/placeholder-property.jpg';
            }}
          />
          <div className="absolute top-3 left-3">
            <Badge variant="primary" className="font-semibold">
              {getPropertyTypeLabel(property.propertyType)}
            </Badge>
          </div>
          <button
            onClick={handleSaveClick}
            className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 ${
              isSaved 
                ? "bg-accent text-white" 
                : "bg-white/90 text-gray-600 hover:bg-accent hover:text-white"
            }`}
          >
            <ApperIcon name="Heart" className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
          </button>
          {property.featured && (
            <div className="absolute bottom-3 left-3">
              <Badge variant="accent" className="font-semibold">
                Featured
              </Badge>
            </div>
          )}
        </div>
        
        <div className="p-4">
          <div className="mb-2">
            <h3 className="font-display font-semibold text-lg text-gray-900 group-hover:text-primary transition-colors">
              {property.title}
            </h3>
            <p className="text-2xl font-display font-bold text-primary mt-1">
              {formatPrice(property.price)}
            </p>
          </div>
          
          <div className="flex items-center text-gray-600 text-sm mb-3">
            <ApperIcon name="MapPin" className="w-4 h-4 mr-1" />
            <span className="truncate">{property.address}</span>
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-700">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <ApperIcon name="Bed" className="w-4 h-4 mr-1" />
                <span>{property.bedrooms} bed</span>
              </div>
              <div className="flex items-center">
                <ApperIcon name="Bath" className="w-4 h-4 mr-1" />
                <span>{property.bathrooms} bath</span>
              </div>
              <div className="flex items-center">
                <ApperIcon name="Square" className="w-4 h-4 mr-1" />
                <span>{formatSquareFeet(property.squareFeet)} sqft</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
</motion.div>
  );
});

PropertyCard.displayName = 'PropertyCard';

export default PropertyCard;