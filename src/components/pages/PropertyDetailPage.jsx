import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ImageGallery from "@/components/molecules/ImageGallery";
import ContactForm from "@/components/molecules/ContactForm";
import PropertyCard from "@/components/molecules/PropertyCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { propertyService } from "@/services/api/propertyService";
import { savedService } from "@/services/api/savedService";
import { formatPrice, formatSquareFeet, getPropertyTypeLabel, formatDate } from "@/utils/formatters";
import { toast } from "react-toastify";

const PropertyDetailPage = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [similarProperties, setSimilarProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [savedProperties, setSavedProperties] = useState([]);

  useEffect(() => {
    loadProperty();
    loadSavedStatus();
  }, [id]);

  useEffect(() => {
    if (property) {
      loadSimilarProperties();
    }
  }, [property]);

  const loadProperty = async () => {
    setLoading(true);
    setError("");
    
    try {
      const data = await propertyService.getById(id);
      setProperty(data);
    } catch (err) {
      setError("Property not found or failed to load.");
      console.error("Error loading property:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadSimilarProperties = async () => {
    try {
      const similar = await propertyService.getSimilar(id);
      setSimilarProperties(similar);
    } catch (err) {
      console.error("Error loading similar properties:", err);
    }
  };

  const loadSavedStatus = async () => {
    try {
      const saved = await savedService.getSavedProperties();
      setSavedProperties(saved);
      setIsSaved(saved.includes(parseInt(id)));
    } catch (err) {
      console.error("Error loading saved status:", err);
    }
  };

  const handleSaveProperty = async () => {
    try {
      if (isSaved) {
        await savedService.unsaveProperty(id);
        setSavedProperties(prev => prev.filter(propId => propId !== parseInt(id)));
        setIsSaved(false);
        toast.success("Property removed from saved list");
      } else {
        await savedService.saveProperty(id);
        setSavedProperties(prev => [...prev, parseInt(id)]);
        setIsSaved(true);
        toast.success("Property saved successfully");
      }
    } catch (err) {
      toast.error("Failed to update saved properties");
      console.error("Error saving property:", err);
    }
  };

  const handleSaveSimilarProperty = async (propertyId) => {
    try {
      const isPropertySaved = savedProperties.includes(propertyId);
      
      if (isPropertySaved) {
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
  if (error) return <Error message={error} onRetry={loadProperty} />;
  if (!property) return <Error message="Property not found" />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-2 text-sm text-gray-600 mb-6"
      >
        <Link to="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <ApperIcon name="ChevronRight" className="w-4 h-4" />
        <Link to="/" className="hover:text-primary transition-colors">
          Properties
        </Link>
        <ApperIcon name="ChevronRight" className="w-4 h-4" />
        <span className="text-gray-900 truncate">{property.title}</span>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Property Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <Badge variant="primary">
                    {getPropertyTypeLabel(property.propertyType)}
                  </Badge>
                  {property.featured && (
                    <Badge variant="accent">
                      <ApperIcon name="Star" className="w-3 h-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                </div>
                <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
                  {property.title}
                </h1>
                <div className="flex items-center text-gray-600 mb-3">
                  <ApperIcon name="MapPin" className="w-5 h-5 mr-2" />
                  <span>{property.address}</span>
                </div>
                <p className="text-4xl font-display font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {formatPrice(property.price)}
                </p>
              </div>
              
              <Button
                onClick={handleSaveProperty}
                variant={isSaved ? "accent" : "outline"}
                className="flex items-center space-x-2"
              >
                <ApperIcon name="Heart" className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
                <span>{isSaved ? "Saved" : "Save"}</span>
              </Button>
            </div>

            {/* Property Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <ApperIcon name="Bed" className="w-5 h-5 text-primary" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{property.bedrooms}</div>
                <div className="text-sm text-gray-600">Bedrooms</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <ApperIcon name="Bath" className="w-5 h-5 text-primary" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{property.bathrooms}</div>
                <div className="text-sm text-gray-600">Bathrooms</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <ApperIcon name="Square" className="w-5 h-5 text-primary" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{formatSquareFeet(property.squareFeet)}</div>
                <div className="text-sm text-gray-600">Sq Ft</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <ApperIcon name="Calendar" className="w-5 h-5 text-primary" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{property.yearBuilt}</div>
                <div className="text-sm text-gray-600">Year Built</div>
              </div>
            </div>
          </motion.div>

          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <ImageGallery images={property.images} title={property.title} />
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-card p-6"
          >
            <h2 className="text-xl font-display font-semibold text-gray-900 mb-4">
              Property Description
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {property.description}
            </p>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Listed on {formatDate(property.listingDate)}
              </p>
            </div>
          </motion.div>

          {/* Amenities */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-card p-6"
          >
            <h2 className="text-xl font-display font-semibold text-gray-900 mb-4">
              Amenities & Features
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {property.amenities.map((amenity, index) => (
                <div
                  key={index}
                  className="flex items-center p-3 bg-gray-50 rounded-lg"
                >
                  <ApperIcon name="Check" className="w-4 h-4 text-success mr-2 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{amenity}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <ContactForm 
                propertyTitle={property.title}
                propertyPrice={formatPrice(property.price)}
              />
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-lg shadow-card p-6"
            >
              <h3 className="text-lg font-display font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <ApperIcon name="Calculator" className="w-4 h-4 mr-2" />
                  Mortgage Calculator
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <ApperIcon name="Share" className="w-4 h-4 mr-2" />
                  Share Property
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <ApperIcon name="MapPin" className="w-4 h-4 mr-2" />
                  View on Map
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Similar Properties */}
      {similarProperties.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16"
        >
          <h2 className="text-2xl font-display font-bold text-gray-900 mb-6">
            Similar Properties
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarProperties.map((similarProperty, index) => (
              <motion.div
                key={similarProperty.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <PropertyCard
                  property={similarProperty}
                  onSave={handleSaveSimilarProperty}
                  isSaved={savedProperties.includes(similarProperty.Id)}
                />
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}
    </div>
  );
};

export default PropertyDetailPage;