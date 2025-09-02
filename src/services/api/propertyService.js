import propertyData from "@/services/mockData/properties.json";

let properties = [...propertyData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const propertyService = {
  async getAll() {
    await delay(300);
    return [...properties];
  },

  async getById(id) {
    await delay(200);
    const property = properties.find(p => p.Id === parseInt(id));
    if (!property) {
      throw new Error("Property not found");
    }
    return { ...property };
  },

  async search(filters) {
    await delay(400);
    let filtered = [...properties];

    if (filters.priceMin !== undefined && filters.priceMin !== null) {
      filtered = filtered.filter(p => p.price >= filters.priceMin);
    }
    
    if (filters.priceMax !== undefined && filters.priceMax !== null) {
      filtered = filtered.filter(p => p.price <= filters.priceMax);
    }
    
    if (filters.propertyTypes && filters.propertyTypes.length > 0) {
      filtered = filtered.filter(p => filters.propertyTypes.includes(p.propertyType));
    }
    
    if (filters.bedroomsMin !== undefined && filters.bedroomsMin !== null) {
      filtered = filtered.filter(p => p.bedrooms >= filters.bedroomsMin);
    }
    
    if (filters.bathroomsMin !== undefined && filters.bathroomsMin !== null) {
      filtered = filtered.filter(p => p.bathrooms >= filters.bathroomsMin);
    }
    
    if (filters.squareFeetMin !== undefined && filters.squareFeetMin !== null) {
      filtered = filtered.filter(p => p.squareFeet >= filters.squareFeetMin);
    }
    
    if (filters.amenities && filters.amenities.length > 0) {
      filtered = filtered.filter(p => 
        filters.amenities.some(amenity => p.amenities.includes(amenity))
      );
    }
    
    if (filters.query) {
      const query = filters.query.toLowerCase();
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(query) ||
        p.address.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
      );
    }

    return filtered;
  },

  async getFeatured() {
    await delay(250);
    return properties.filter(p => p.featured).slice(0, 6);
  },

  async getSimilar(propertyId, limit = 3) {
    await delay(300);
    const currentProperty = properties.find(p => p.Id === parseInt(propertyId));
    if (!currentProperty) return [];
    
    const similar = properties
      .filter(p => 
        p.Id !== parseInt(propertyId) &&
        p.propertyType === currentProperty.propertyType &&
        Math.abs(p.price - currentProperty.price) < 100000
      )
      .slice(0, limit);
      
    return similar;
  }
};