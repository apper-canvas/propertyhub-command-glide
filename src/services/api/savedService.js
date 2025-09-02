let savedProperties = [];
let savedSearches = [
  {
    Id: 1,
    name: "Modern Condos Under $500K",
    filters: {
      priceMax: 500000,
      propertyTypes: ["condo"],
      bedroomsMin: 2
    },
    createdAt: new Date("2024-01-15"),
    resultCount: 12
  },
  {
    Id: 2,
    name: "Downtown Houses",
    filters: {
      query: "downtown",
      propertyTypes: ["house"],
      priceMin: 300000
    },
    createdAt: new Date("2024-01-20"),
    resultCount: 8
  }
];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const savedService = {
  async getSavedProperties() {
    await delay(200);
    return [...savedProperties];
  },

  async saveProperty(propertyId) {
    await delay(150);
    const id = parseInt(propertyId);
    if (!savedProperties.includes(id)) {
      savedProperties.push(id);
    }
    return true;
  },

  async unsaveProperty(propertyId) {
    await delay(150);
    const id = parseInt(propertyId);
    savedProperties = savedProperties.filter(p => p !== id);
    return true;
  },

  async isPropertySaved(propertyId) {
    const id = parseInt(propertyId);
    return savedProperties.includes(id);
  },

  async getSavedSearches() {
    await delay(200);
    return [...savedSearches];
  },

  async saveSearch(searchData) {
    await delay(200);
    const highestId = savedSearches.length > 0 
      ? Math.max(...savedSearches.map(s => s.Id)) 
      : 0;
    
    const newSearch = {
      Id: highestId + 1,
      name: searchData.name,
      filters: { ...searchData.filters },
      createdAt: new Date(),
      resultCount: searchData.resultCount || 0
    };
    
    savedSearches.push(newSearch);
    return { ...newSearch };
  },

  async deleteSearch(searchId) {
    await delay(150);
    const id = parseInt(searchId);
    savedSearches = savedSearches.filter(s => s.Id !== id);
    return true;
  }
};