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

const tableName = 'saved_search_c';

export const savedService = {
  async getSavedProperties() {
    try {
      const client = initializeClient();
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "property_id_c"}}
        ],
        where: [{
          FieldName: "type_c",
          Operator: "ExactMatch",
          Values: ["property"],
          Include: true
        }]
      };
      
      const response = await client.fetchRecords(tableName, params);
      
      if (!response?.data?.length) {
        return [];
      }
      
      return response.data.map(item => parseInt(item.property_id_c)).filter(id => !isNaN(id));
    } catch (error) {
      console.error("Error fetching saved properties:", error?.response?.data?.message || error);
      return [];
    }
  },

  async saveProperty(propertyId) {
    try {
      const client = initializeClient();
      const id = parseInt(propertyId);
      
      const params = {
        records: [{
          type_c: "property",
          property_id_c: id
        }]
      };
      
      const response = await client.createRecord(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Error saving property:", error?.response?.data?.message || error);
      return false;
    }
  },

  async unsaveProperty(propertyId) {
    try {
      const client = initializeClient();
      const id = parseInt(propertyId);
      
      const findParams = {
        fields: [{"field": {"Name": "Id"}}],
        where: [
          {
            FieldName: "type_c",
            Operator: "ExactMatch",
            Values: ["property"],
            Include: true
          },
          {
            FieldName: "property_id_c",
            Operator: "ExactMatch",
            Values: [id],
            Include: true
          }
        ]
      };
      
      const findResponse = await client.fetchRecords(tableName, findParams);
      
      if (findResponse?.data?.length > 0) {
        const recordToDelete = findResponse.data[0];
        const deleteParams = {
          RecordIds: [recordToDelete.Id]
        };
        
        const response = await client.deleteRecord(tableName, deleteParams);
        
        if (!response.success) {
          console.error(response.message);
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.error("Error unsaving property:", error?.response?.data?.message || error);
      return false;
    }
  },

  async isPropertySaved(propertyId) {
    try {
      const savedProperties = await this.getSavedProperties();
      const id = parseInt(propertyId);
      return savedProperties.includes(id);
    } catch (error) {
      console.error("Error checking if property is saved:", error?.response?.data?.message || error);
      return false;
    }
  },

  async getSavedSearches() {
    try {
      const client = initializeClient();
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "filters_c"}},
          {"field": {"Name": "result_count_c"}},
          {"field": {"Name": "created_date_c"}}
        ],
        where: [{
          FieldName: "type_c",
          Operator: "ExactMatch",
          Values: ["search"],
          Include: true
        }]
      };
      
      const response = await client.fetchRecords(tableName, params);
      
      if (!response?.data?.length) {
        return [];
      }
      
      return response.data.map(item => ({
        Id: item.Id,
        name: item.name_c || '',
        filters: item.filters_c ? JSON.parse(item.filters_c) : {},
        resultCount: item.result_count_c || 0,
        createdAt: item.created_date_c || new Date().toISOString()
      }));
    } catch (error) {
      console.error("Error fetching saved searches:", error?.response?.data?.message || error);
      return [];
    }
  },

  async saveSearch(searchData) {
    try {
      const client = initializeClient();
      
      const params = {
        records: [{
          type_c: "search",
          name_c: searchData.name,
          filters_c: JSON.stringify(searchData.filters),
          result_count_c: searchData.resultCount || 0,
          created_date_c: new Date().toISOString()
        }]
      };
      
      const response = await client.createRecord(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      if (response.results && response.results.length > 0 && response.results[0].success) {
        const created = response.results[0].data;
        return {
          Id: created.Id,
          name: created.name_c || '',
          filters: created.filters_c ? JSON.parse(created.filters_c) : {},
          resultCount: created.result_count_c || 0,
          createdAt: created.created_date_c || new Date().toISOString()
        };
      }
      
      return null;
    } catch (error) {
      console.error("Error saving search:", error?.response?.data?.message || error);
      return null;
    }
  },

  async deleteSearch(searchId) {
    try {
      const client = initializeClient();
      const id = parseInt(searchId);
      
      const params = {
        RecordIds: [id]
      };
      
      const response = await client.deleteRecord(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting search:", error?.response?.data?.message || error);
      return false;
    }
  }
};