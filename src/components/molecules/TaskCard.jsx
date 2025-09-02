import React, { memo } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import { format, isAfter, parseISO } from 'date-fns';

const TaskCard = memo(({ task, propertyName, onEdit, onDelete }) => {
  if (!task) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'Not Started':
        return 'bg-gray-100 text-gray-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Deferred':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isOverdue = task.due_date_c && isAfter(new Date(), parseISO(task.due_date_c));
  
  const formatDueDate = (dateString) => {
    if (!dateString) return null;
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-card hover:shadow-card-hover overflow-hidden group transition-all duration-200"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-display font-semibold text-lg text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
              {task.name_c || 'Untitled Task'}
            </h3>
            <Badge className={`mt-2 ${getStatusColor(task.status_c)}`}>
              {task.status_c || 'Not Started'}
            </Badge>
          </div>
          <div className="flex items-center space-x-2 ml-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(task)}
              className="p-2"
            >
              <ApperIcon name="Edit2" className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(task.Id)}
              className="p-2 text-red-600 hover:text-red-700"
            >
              <ApperIcon name="Trash2" className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Description */}
        {task.description_c && (
          <div className="mb-4">
            <p className="text-gray-600 text-sm line-clamp-3">
              {task.description_c}
            </p>
          </div>
        )}

        {/* Property */}
        {propertyName && propertyName !== 'No Property' && (
          <div className="flex items-center text-gray-600 text-sm mb-3">
            <ApperIcon name="Home" className="w-4 h-4 mr-2" />
            <span className="truncate">{propertyName}</span>
          </div>
        )}

        {/* Assignment */}
        {task.assigned_to_c && task.assigned_to_c.Name && (
          <div className="flex items-center text-gray-600 text-sm mb-3">
            <ApperIcon name="User" className="w-4 h-4 mr-2" />
            <span>Assigned to {task.assigned_to_c.Name}</span>
          </div>
        )}

        {/* Due Date */}
        {task.due_date_c && (
          <div className={`flex items-center text-sm mb-3 ${
            isOverdue ? 'text-red-600' : 'text-gray-600'
          }`}>
            <ApperIcon 
              name={isOverdue ? "AlertCircle" : "Calendar"} 
              className="w-4 h-4 mr-2" 
            />
            <span>
              Due {formatDueDate(task.due_date_c)}
              {isOverdue && ' (Overdue)'}
            </span>
          </div>
        )}

        {/* Footer */}
        <div className="pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>
              Created {task.CreatedOn ? format(parseISO(task.CreatedOn), 'MMM dd, yyyy') : ''}
            </span>
            {task.status_c === 'Completed' && (
              <div className="flex items-center text-green-600">
                <ApperIcon name="CheckCircle" className="w-3 h-3 mr-1" />
                <span>Completed</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
});

TaskCard.displayName = 'TaskCard';

export default TaskCard;