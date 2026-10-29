const Joi = require('joi');

const createTaskSchema = Joi.object({
  title: Joi.string().trim().min(1).max(100).required().messages({
    'string.min': 'Title cannot be empty',
    'string.max': 'Title cannot exceed 100 characters',
    'any.required': 'Title is required',
  }),
  description: Joi.string().trim().max(500).allow('').default('').messages({
    'string.max': 'Description cannot exceed 500 characters',
  }),
  status: Joi.string()
    .valid('pending', 'in-progress', 'completed')
    .default('pending'),
  priority: Joi.string().valid('low', 'medium', 'high').default('medium'),
  dueDate: Joi.date().iso().allow(null).default(null),
});

const updateTaskSchema = Joi.object({
  title: Joi.string().trim().min(1).max(100).messages({
    'string.min': 'Title cannot be empty',
    'string.max': 'Title cannot exceed 100 characters',
  }),
  description: Joi.string().trim().max(500).allow('').messages({
    'string.max': 'Description cannot exceed 500 characters',
  }),
  status: Joi.string().valid('pending', 'in-progress', 'completed'),
  priority: Joi.string().valid('low', 'medium', 'high'),
  dueDate: Joi.date().iso().allow(null),
}).min(1); // at least one field required

module.exports = { createTaskSchema, updateTaskSchema };
