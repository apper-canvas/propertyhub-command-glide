import React, { useState } from "react";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Label from "@/components/atoms/Label";
import ApperIcon from "@/components/ApperIcon";

const ContactForm = ({ propertyTitle, propertyPrice }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: `I'm interested in ${propertyTitle} listed at ${propertyPrice}. Please contact me to schedule a viewing.`
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success("Your inquiry has been sent successfully! We'll contact you soon.");
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: ""
      });
    } catch (error) {
      toast.error("Failed to send inquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-card p-6">
      <div className="flex items-center mb-4">
        <ApperIcon name="MessageCircle" className="w-5 h-5 text-primary mr-2" />
        <h3 className="text-lg font-display font-semibold text-gray-900">
          Contact Agent
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label required>Full Name</Label>
          <Input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="Enter your full name"
            required
          />
        </div>

        <div>
          <Label required>Email Address</Label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            placeholder="Enter your email address"
            required
          />
        </div>

        <div>
          <Label>Phone Number</Label>
          <Input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            placeholder="Enter your phone number"
          />
        </div>

        <div>
          <Label>Message</Label>
          <textarea
            value={formData.message}
            onChange={(e) => handleInputChange("message", e.target.value)}
            placeholder="Tell us about your interests and any questions you have..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors resize-vertical"
          />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting || !formData.name || !formData.email}
          className="w-full"
        >
          {isSubmitting ? (
            <>
              <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <ApperIcon name="Send" className="w-4 h-4 mr-2" />
              Send Inquiry
            </>
          )}
        </Button>
      </form>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center">
            <ApperIcon name="Clock" className="w-4 h-4 mr-1" />
            <span>Response within 24 hours</span>
          </div>
          <div className="flex items-center">
            <ApperIcon name="Shield" className="w-4 h-4 mr-1" />
            <span>Secure & Private</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;