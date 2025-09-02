import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Label from '@/components/atoms/Label';
import { createTask, updateTask } from '@/services/api/taskService';

const TaskForm = ({ task, properties = [], onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name_c: '',
    description_c: '',
    status_c: 'Not Started',
    due_date_c: '',
    assigned_to_c: '',
    property_c: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const statusOptions = [
    { value: 'Not Started', label: 'Not Started' },
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Completed', label: 'Completed' },
    { value: 'Deferred', label: 'Deferred' }
  ];

  useEffect(() => {
    if (task) {
      setFormData({
        name_c: task.name_c || '',
        description_c: task.description_c || '',
        status_c: task.status_c || 'Not Started',
        due_date_c: task.due_date_c ? task.due_date_c.split('T')[0] : '',
        assigned_to_c: task.assigned_to_c?.Id?.toString() || '',
        property_c: task.property_c?.Id?.toString() || ''
      });
    }
  }, [task]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name_c.trim()) {
      newErrors.name_c = 'Task name is required';
    }
    
    if (formData.due_date_c && new Date(formData.due_date_c) < new Date().setHours(0, 0, 0, 0)) {
      newErrors.due_date_c = 'Due date cannot be in the past';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const submitData = {
        ...formData,
        due_date_c: formData.due_date_c || null,
        assigned_to_c: formData.assigned_to_c || null,
        property_c: formData.property_c || null
      };

      if (task) {
        await updateTask(task.Id, submitData);
      } else {
        await createTask(submitData);
      }
      
      onSave();
    } catch (error) {
      toast.error(error.message || `Failed to ${task ? 'update' : 'create'} task`);
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-display font-bold text-gray-900">
              {task ? 'Edit Task' : 'Create New Task'}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ApperIcon name="X" className="w-6 h-6" />
            </button>
          </div>

          {/* Form Content */}
          <div className="p-6 space-y-6">
            {/* Task Name */}
            <div>
              <Label htmlFor="name_c" className="text-sm font-medium text-gray-700 mb-2">
                Task Name *
              </Label>
              <Input
                id="name_c"
                type="text"
                value={formData.name_c}
                onChange={(e) => handleInputChange('name_c', e.target.value)}
                placeholder="Enter task name..."
                className={`w-full ${errors.name_c ? 'border-red-500' : ''}`}
                required
              />
              {errors.name_c && (
                <p className="text-red-500 text-sm mt-1">{errors.name_c}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description_c" className="text-sm font-medium text-gray-700 mb-2">
                Description
              </Label>
              <textarea
                id="description_c"
                value={formData.description_c}
                onChange={(e) => handleInputChange('description_c', e.target.value)}
                placeholder="Enter task description..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Status and Due Date Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="status_c" className="text-sm font-medium text-gray-700 mb-2">
                  Status
                </Label>
                <Select
                  id="status_c"
                  value={formData.status_c}
                  onChange={(e) => handleInputChange('status_c', e.target.value)}
                  options={statusOptions}
                  className="w-full"
                />
              </div>

              <div>
                <Label htmlFor="due_date_c" className="text-sm font-medium text-gray-700 mb-2">
                  Due Date
                </Label>
                <Input
                  id="due_date_c"
                  type="date"
                  value={formData.due_date_c}
                  onChange={(e) => handleInputChange('due_date_c', e.target.value)}
                  className={`w-full ${errors.due_date_c ? 'border-red-500' : ''}`}
                />
                {errors.due_date_c && (
                  <p className="text-red-500 text-sm mt-1">{errors.due_date_c}</p>
                )}
              </div>
            </div>

            {/* Property Assignment */}
            <div>
              <Label htmlFor="property_c" className="text-sm font-medium text-gray-700 mb-2">
                Related Property
              </Label>
              <Select
                id="property_c"
                value={formData.property_c}
                onChange={(e) => handleInputChange('property_c', e.target.value)}
                options={[
                  { value: '', label: 'Select a property (optional)' },
                  ...properties.map(property => ({
                    value: property.Id.toString(),
                    label: property.title || property.Name || `Property ${property.Id}`
                  }))
                ]}
                className="w-full"
              />
            </div>

            {/* Assigned To - Note: This would need user lookup integration in a real implementation */}
            <div>
              <Label htmlFor="assigned_to_c" className="text-sm font-medium text-gray-700 mb-2">
                Assigned To
              </Label>
              <Input
                id="assigned_to_c"
                type="text"
                value={formData.assigned_to_c}
                onChange={(e) => handleInputChange('assigned_to_c', e.target.value)}
                placeholder="User ID (optional)"
                className="w-full"
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">
                User assignment requires additional integration
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2"
            >
              {loading && <ApperIcon name="Loader2" className="w-4 h-4 animate-spin" />}
              <span>{task ? 'Update Task' : 'Create Task'}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;