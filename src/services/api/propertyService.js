const { ApperClient } = window.ApperSDK;

let apperClient;

const initializeClient = () => {
  if (!apperClient) {
    apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }
  return apperClient;
};

const tableName = 'property_c';

export const propertyService = {
  async getAll() {
// Export individual functions for easier importing
export const getAllProperties = propertyService.getAll;
    try {
      const client = initializeClient();
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "coordinates_c"}},
          {"field": {"Name": "bedrooms_c"}},
          {"field": {"Name": "bathrooms_c"}},
          {"field": {"Name": "square_feet_c"}},
          {"field": {"Name": "property_type_c"}},
          {"field": {"Name": "featured_c"}},
          {"field": {"Name": "images_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "amenities_c"}},
          {"field": {"Name": "year_built_c"}},
          {"field": {"Name": "listing_date_c"}}
        ]
      };
      
      const response = await client.fetchRecords(tableName, params);
      
      if (!response?.data?.length) {
        return [];
      }
      
      return response.data.map(item => ({
        Id: item.Id,
        title: item.title_c || '',
        price: item.price_c || 0,
        address: item.address_c || '',
        coordinates: item.coordinates_c ? JSON.parse(item.coordinates_c) : { lat: 0, lng: 0 },
        bedrooms: item.bedrooms_c || 0,
        bathrooms: item.bathrooms_c || 0,
        squareFeet: item.square_feet_c || 0,
        propertyType: item.property_type_c || '',
        featured: item.featured_c || false,
        images: item.images_c ? JSON.parse(item.images_c) : [],
        description: item.description_c || '',
        amenities: item.amenities_c ? JSON.parse(item.amenities_c) : [],
        yearBuilt: item.year_built_c || 0,
        listingDate: item.listing_date_c || ''
      }));
    } catch (error) {
      console.error("Error fetching properties:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const client = initializeClient();
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "coordinates_c"}},
          {"field": {"Name": "bedrooms_c"}},
          {"field": {"Name": "bathrooms_c"}},
          {"field": {"Name": "square_feet_c"}},
          {"field": {"Name": "property_type_c"}},
          {"field": {"Name": "featured_c"}},
          {"field": {"Name": "images_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "amenities_c"}},
          {"field": {"Name": "year_built_c"}},
          {"field": {"Name": "listing_date_c"}}
        ]
      };
      
      const response = await client.getRecordById(tableName, parseInt(id), params);
      
      if (!response?.data) {
        throw new Error("Property not found");
      }
      
      const item = response.data;
      return {
        Id: item.Id,
        title: item.title_c || '',
        price: item.price_c || 0,
        address: item.address_c || '',
        coordinates: item.coordinates_c ? JSON.parse(item.coordinates_c) : { lat: 0, lng: 0 },
        bedrooms: item.bedrooms_c || 0,
        bathrooms: item.bathrooms_c || 0,
        squareFeet: item.square_feet_c || 0,
        propertyType: item.property_type_c || '',
        featured: item.featured_c || false,
        images: item.images_c ? JSON.parse(item.images_c) : [],
        description: item.description_c || '',
        amenities: item.amenities_c ? JSON.parse(item.amenities_c) : [],
        yearBuilt: item.year_built_c || 0,
        listingDate: item.listing_date_c || ''
      };
    } catch (error) {
      console.error(`Error fetching property ${id}:`, error?.response?.data?.message || error);
      throw new Error("Property not found");
    }
  },

  async search(filters) {
    try {
      const client = initializeClient();
      const whereConditions = [];
      
      if (filters.priceMin !== undefined && filters.priceMin !== null) {
        whereConditions.push({
          FieldName: "price_c",
          Operator: "GreaterThanOrEqualTo",
          Values: [filters.priceMin],
          Include: true
        });
      }
      
      if (filters.priceMax !== undefined && filters.priceMax !== null) {
        whereConditions.push({
          FieldName: "price_c",
          Operator: "LessThanOrEqualTo",
          Values: [filters.priceMax],
          Include: true
        });
      }
      
      if (filters.propertyTypes && filters.propertyTypes.length > 0) {
        whereConditions.push({
          FieldName: "property_type_c",
          Operator: "ExactMatch",
          Values: filters.propertyTypes,
          Include: true
        });
      }
      
      if (filters.bedroomsMin !== undefined && filters.bedroomsMin !== null) {
        whereConditions.push({
          FieldName: "bedrooms_c",
          Operator: "GreaterThanOrEqualTo",
          Values: [filters.bedroomsMin],
          Include: true
        });
      }
      
      if (filters.bathroomsMin !== undefined && filters.bathroomsMin !== null) {
        whereConditions.push({
          FieldName: "bathrooms_c",
          Operator: "GreaterThanOrEqualTo",
          Values: [filters.bathroomsMin],
          Include: true
        });
      }
      
      if (filters.squareFeetMin !== undefined && filters.squareFeetMin !== null) {
        whereConditions.push({
          FieldName: "square_feet_c",
          Operator: "GreaterThanOrEqualTo",
          Values: [filters.squareFeetMin],
          Include: true
        });
      }
      
      if (filters.query) {
        whereConditions.push({
          FieldName: "title_c",
          Operator: "Contains",
          Values: [filters.query],
          Include: true
        });
      }
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "coordinates_c"}},
          {"field": {"Name": "bedrooms_c"}},
          {"field": {"Name": "bathrooms_c"}},
          {"field": {"Name": "square_feet_c"}},
          {"field": {"Name": "property_type_c"}},
          {"field": {"Name": "featured_c"}},
          {"field": {"Name": "images_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "amenities_c"}},
          {"field": {"Name": "year_built_c"}},
          {"field": {"Name": "listing_date_c"}}
        ],
        where: whereConditions
      };
      
      const response = await client.fetchRecords(tableName, params);
      
      if (!response?.data?.length) {
        return [];
      }
      
      return response.data.map(item => ({
        Id: item.Id,
        title: item.title_c || '',
        price: item.price_c || 0,
        address: item.address_c || '',
        coordinates: item.coordinates_c ? JSON.parse(item.coordinates_c) : { lat: 0, lng: 0 },
        bedrooms: item.bedrooms_c || 0,
        bathrooms: item.bathrooms_c || 0,
        squareFeet: item.square_feet_c || 0,
        propertyType: item.property_type_c || '',
        featured: item.featured_c || false,
        images: item.images_c ? JSON.parse(item.images_c) : [],
        description: item.description_c || '',
        amenities: item.amenities_c ? JSON.parse(item.amenities_c) : [],
        yearBuilt: item.year_built_c || 0,
        listingDate: item.listing_date_c || ''
      }));
    } catch (error) {
      console.error("Error searching properties:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getFeatured() {
    try {
      const client = initializeClient();
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "coordinates_c"}},
          {"field": {"Name": "bedrooms_c"}},
          {"field": {"Name": "bathrooms_c"}},
          {"field": {"Name": "square_feet_c"}},
          {"field": {"Name": "property_type_c"}},
          {"field": {"Name": "featured_c"}},
          {"field": {"Name": "images_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "amenities_c"}},
          {"field": {"Name": "year_built_c"}},
          {"field": {"Name": "listing_date_c"}}
        ],
        where: [{
          FieldName: "featured_c",
          Operator: "ExactMatch",
          Values: [true],
          Include: true
        }],
        pagingInfo: { limit: 6, offset: 0 }
      };
      
      const response = await client.fetchRecords(tableName, params);
      
      if (!response?.data?.length) {
        return [];
      }
      
      return response.data.map(item => ({
        Id: item.Id,
        title: item.title_c || '',
        price: item.price_c || 0,
        address: item.address_c || '',
        coordinates: item.coordinates_c ? JSON.parse(item.coordinates_c) : { lat: 0, lng: 0 },
        bedrooms: item.bedrooms_c || 0,
        bathrooms: item.bathrooms_c || 0,
        squareFeet: item.square_feet_c || 0,
        propertyType: item.property_type_c || '',
        featured: item.featured_c || false,
        images: item.images_c ? JSON.parse(item.images_c) : [],
        description: item.description_c || '',
        amenities: item.amenities_c ? JSON.parse(item.amenities_c) : [],
        yearBuilt: item.year_built_c || 0,
        listingDate: item.listing_date_c || ''
      }));
    } catch (error) {
      console.error("Error fetching featured properties:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getSimilar(propertyId, limit = 3) {
    try {
      const currentProperty = await this.getById(propertyId);
      if (!currentProperty) return [];
      
      const client = initializeClient();
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "coordinates_c"}},
          {"field": {"Name": "bedrooms_c"}},
          {"field": {"Name": "bathrooms_c"}},
          {"field": {"Name": "square_feet_c"}},
          {"field": {"Name": "property_type_c"}},
          {"field": {"Name": "featured_c"}},
          {"field": {"Name": "images_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "amenities_c"}},
          {"field": {"Name": "year_built_c"}},
          {"field": {"Name": "listing_date_c"}}
        ],
        where: [
          {
            FieldName: "property_type_c",
            Operator: "ExactMatch",
            Values: [currentProperty.propertyType],
            Include: true
          },
          {
            FieldName: "Id",
            Operator: "NotEqualTo",
            Values: [parseInt(propertyId)],
            Include: true
          }
        ],
        pagingInfo: { limit: limit, offset: 0 }
      };
      
      const response = await client.fetchRecords(tableName, params);
      
      if (!response?.data?.length) {
        return [];
      }
      
      return response.data.map(item => ({
        Id: item.Id,
        title: item.title_c || '',
        price: item.price_c || 0,
        address: item.address_c || '',
        coordinates: item.coordinates_c ? JSON.parse(item.coordinates_c) : { lat: 0, lng: 0 },
        bedrooms: item.bedrooms_c || 0,
        bathrooms: item.bathrooms_c || 0,
        squareFeet: item.square_feet_c || 0,
        propertyType: item.property_type_c || '',
        featured: item.featured_c || false,
        images: item.images_c ? JSON.parse(item.images_c) : [],
        description: item.description_c || '',
        amenities: item.amenities_c ? JSON.parse(item.amenities_c) : [],
        yearBuilt: item.year_built_c || 0,
        listingDate: item.listing_date_c || ''
      }));
    } catch (error) {
      console.error("Error fetching similar properties:", error?.response?.data?.message || error);
      return [];
    }
  }
};