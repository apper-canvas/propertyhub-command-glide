import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Select from '@/components/atoms/Select';
import Input from '@/components/atoms/Input';
import TaskCard from '@/components/molecules/TaskCard';
import TaskForm from '@/components/molecules/TaskForm';
import Loading from '@/components/ui/Loading';
import Empty from '@/components/ui/Empty';
import Error from '@/components/ui/Error';
import { getAllTasks, deleteTask, getTasksByProperty } from '@/services/api/taskService';
import { getAllProperties } from '@/services/api/propertyService';

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState('');
  const [propertyFilter, setPropertyFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'Not Started', label: 'Not Started' },
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Completed', label: 'Completed' },
    { value: 'Deferred', label: 'Deferred' }
  ];

  useEffect(() => {
    loadTasks();
    loadProperties();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const tasksData = await getAllTasks();
      setTasks(tasksData);
    } catch (err) {
      setError(err.message || 'Failed to load tasks');
      console.error('Error loading tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadProperties = async () => {
    try {
      const propertiesData = await getAllProperties();
      setProperties(propertiesData);
    } catch (err) {
      console.error('Error loading properties:', err);
    }
  };

  const handleCreateTask = () => {
    setEditingTask(null);
    setShowTaskForm(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleTaskFormClose = () => {
    setShowTaskForm(false);
    setEditingTask(null);
  };

  const handleTaskSaved = () => {
    setShowTaskForm(false);
    setEditingTask(null);
    loadTasks();
    toast.success(editingTask ? 'Task updated successfully!' : 'Task created successfully!');
  };

  const handleDeleteTask = async (taskId) => {
    setDeleteConfirm(taskId);
  };

  const confirmDeleteTask = async () => {
    if (!deleteConfirm) return;
    
    try {
      await deleteTask(deleteConfirm);
      setTasks(prev => prev.filter(task => task.Id !== deleteConfirm));
      toast.success('Task deleted successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to delete task');
      console.error('Error deleting task:', err);
    } finally {
      setDeleteConfirm(null);
    }
  };

  const getPropertyName = (propertyId) => {
    if (!propertyId || !propertyId.Id) return 'No Property';
    const property = properties.find(p => p.Id === propertyId.Id);
    return property?.title || propertyId.Name || 'Unknown Property';
  };

  const filteredTasks = tasks.filter(task => {
    const matchesStatus = !statusFilter || task.status_c === statusFilter;
    const matchesProperty = !propertyFilter || 
      (task.property_c && task.property_c.Id === parseInt(propertyFilter));
    const matchesSearch = !searchTerm || 
      task.name_c?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description_c?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesProperty && matchesSearch;
  });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Error message={error} onRetry={loadTasks} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">
            Tasks
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your property-related tasks and assignments
          </p>
        </div>
        <Button onClick={handleCreateTask} className="flex items-center space-x-2">
          <ApperIcon name="Plus" className="w-4 h-4" />
          <span>Add Task</span>
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-card p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Tasks
            </label>
            <Input
              type="text"
              placeholder="Search by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={statusOptions}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Property
            </label>
            <Select
              value={propertyFilter}
              onChange={(e) => setPropertyFilter(e.target.value)}
              options={[
                { value: '', label: 'All Properties' },
                ...properties.map(property => ({
                  value: property.Id.toString(),
                  label: property.title || property.Name || `Property ${property.Id}`
                }))
              ]}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Tasks Grid */}
      {filteredTasks.length === 0 ? (
        <Empty 
          title="No tasks found"
          description={
            tasks.length === 0 
              ? "Get started by creating your first task"
              : "Try adjusting your search filters"
          }
          actionText="Add Task"
          onAction={handleCreateTask}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.Id}
              task={task}
              propertyName={getPropertyName(task.property_c)}
              onEdit={() => handleEditTask(task)}
              onDelete={() => handleDeleteTask(task.Id)}
            />
          ))}
        </div>
      )}

      {/* Task Form Modal */}
      {showTaskForm && (
        <TaskForm
          task={editingTask}
          properties={properties}
          onClose={handleTaskFormClose}
          onSave={handleTaskSaved}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <ApperIcon name="Trash2" className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Delete Task
                </h3>
                <p className="text-gray-600">
                  Are you sure you want to delete this task? This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setDeleteConfirm(null)}
              >
                Cancel
              </Button>
              <Button
                variant="accent"
                onClick={confirmDeleteTask}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksPage;