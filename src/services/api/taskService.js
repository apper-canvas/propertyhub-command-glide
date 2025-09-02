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

const tableName = 'task_c';

// Helper function to add delay for realistic API simulation
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getAllTasks = async () => {
  await delay(300);
  try {
    const client = initializeClient();
    
    const params = {
      fields: [
        {"field": {"Name": "Id"}},
        {"field": {"Name": "name_c"}},
        {"field": {"Name": "description_c"}},
        {"field": {"Name": "status_c"}},
        {"field": {"Name": "due_date_c"}},
        {"field": {"Name": "assigned_to_c"}},
        {"field": {"Name": "property_c"}},
        {"field": {"Name": "CreatedOn"}},
        {"field": {"Name": "CreatedBy"}},
        {"field": {"Name": "ModifiedOn"}}
      ],
      orderBy: [{"fieldName": "due_date_c", "sorttype": "ASC"}],
      pagingInfo: {"limit": 50, "offset": 0}
    };

    const response = await client.fetchRecords(tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    return response.data || [];
  } catch (error) {
    console.error("Error fetching tasks:", error?.response?.data?.message || error);
    throw error;
  }
};

export const getTaskById = async (taskId) => {
  await delay(200);
  try {
    const client = initializeClient();
    
    const params = {
      fields: [
        {"field": {"Name": "Id"}},
        {"field": {"Name": "name_c"}},
        {"field": {"Name": "description_c"}},
        {"field": {"Name": "status_c"}},
        {"field": {"Name": "due_date_c"}},
        {"field": {"Name": "assigned_to_c"}},
        {"field": {"Name": "property_c"}},
        {"field": {"Name": "CreatedOn"}},
        {"field": {"Name": "CreatedBy"}},
        {"field": {"Name": "ModifiedOn"}}
      ]
    };

    const response = await client.getRecordById(tableName, taskId, params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching task ${taskId}:`, error?.response?.data?.message || error);
    throw error;
  }
};

export const createTask = async (taskData) => {
  await delay(400);
  try {
    const client = initializeClient();
    
    // Only include Updateable fields in create operation
    const params = {
      records: [{
        name_c: taskData.name_c || '',
        description_c: taskData.description_c || '',
        status_c: taskData.status_c || 'Not Started',
        due_date_c: taskData.due_date_c || null,
        assigned_to_c: taskData.assigned_to_c ? parseInt(taskData.assigned_to_c) : null,
        property_c: taskData.property_c ? parseInt(taskData.property_c) : null
      }]
    };

    const response = await client.createRecord(tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);
      
      if (failed.length > 0) {
        console.error(`Failed to create ${failed.length} tasks:`, JSON.stringify(failed));
        const errorMsg = failed[0].message || 'Failed to create task';
        throw new Error(errorMsg);
      }
      
      return successful[0]?.data;
    }
    
    return null;
  } catch (error) {
    console.error("Error creating task:", error?.response?.data?.message || error);
    throw error;
  }
};

export const updateTask = async (taskId, taskData) => {
  await delay(400);
  try {
    const client = initializeClient();
    
    // Only include Updateable fields in update operation
    const params = {
      records: [{
        Id: parseInt(taskId),
        name_c: taskData.name_c,
        description_c: taskData.description_c,
        status_c: taskData.status_c,
        due_date_c: taskData.due_date_c,
        assigned_to_c: taskData.assigned_to_c ? parseInt(taskData.assigned_to_c) : null,
        property_c: taskData.property_c ? parseInt(taskData.property_c) : null
      }]
    };

    const response = await client.updateRecord(tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);
      
      if (failed.length > 0) {
        console.error(`Failed to update ${failed.length} tasks:`, JSON.stringify(failed));
        const errorMsg = failed[0].message || 'Failed to update task';
        throw new Error(errorMsg);
      }
      
      return successful[0]?.data;
    }
    
    return null;
  } catch (error) {
    console.error("Error updating task:", error?.response?.data?.message || error);
    throw error;
  }
};

export const deleteTask = async (taskId) => {
  await delay(300);
  try {
    const client = initializeClient();
    
    const params = { 
      RecordIds: [parseInt(taskId)]
    };

    const response = await client.deleteRecord(tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);
      
      if (failed.length > 0) {
        console.error(`Failed to delete ${failed.length} tasks:`, JSON.stringify(failed));
        const errorMsg = failed[0].message || 'Failed to delete task';
        throw new Error(errorMsg);
      }
      
      return successful.length > 0;
    }
    
    return false;
  } catch (error) {
    console.error("Error deleting task:", error?.response?.data?.message || error);
    throw error;
  }
};

export const getTasksByProperty = async (propertyId) => {
  await delay(300);
  try {
    const client = initializeClient();
    
    const params = {
      fields: [
        {"field": {"Name": "Id"}},
        {"field": {"Name": "name_c"}},
        {"field": {"Name": "description_c"}},
        {"field": {"Name": "status_c"}},
        {"field": {"Name": "due_date_c"}},
        {"field": {"Name": "assigned_to_c"}},
        {"field": {"Name": "property_c"}}
      ],
      where: [{"FieldName": "property_c", "Operator": "EqualTo", "Values": [parseInt(propertyId)]}],
      orderBy: [{"fieldName": "due_date_c", "sorttype": "ASC"}]
    };

    const response = await client.fetchRecords(tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    return response.data || [];
  } catch (error) {
    console.error(`Error fetching tasks for property ${propertyId}:`, error?.response?.data?.message || error);
    throw error;
  }
};