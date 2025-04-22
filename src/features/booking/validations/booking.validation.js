const Joi = require('joi');

const bookingSchema = Joi.object({
  firstName: Joi.string().required().messages({
    'string.base': 'First name must be a string',
    'string.empty': 'First name is required',
  }),
  lastName: Joi.string().required().messages({
    'string.base': 'Last name must be a string',
    'string.empty': 'Last name is required',
  }),
  email: Joi.string().email().required().messages({
    'string.base': 'Email must be a string',
    'string.email': 'Email must be valid',
    'string.empty': 'Email is required',
  }),
  phone: Joi.string().required().messages({
    'string.base': 'Phone must be a string',
    'string.empty': 'Phone is required',
  }),
  departureAirport: Joi.string().required().messages({
    'string.base': 'Departure airport must be a string',
    'string.empty': 'Departure airport is required',
  }),
  startDate: Joi.date().required().messages({
    'date.base': 'Start date must be a valid date',
    'any.required': 'Start date is required',
  }),
  startTime: Joi.date().required().messages({
    'date.base': 'Start time must be a valid date',
    'any.required': 'Start time is required',
  }),
  endDate: Joi.date().required().messages({
    'date.base': 'End date must be a valid date',
    'any.required': 'End date is required',
  }),
  endTime: Joi.date().required().messages({
    'date.base': 'End time must be a valid date',
    'any.required': 'End time is required',
  }),
  isServices: Joi.boolean().optional(),
  totalAmount: Joi.number().required().messages({
    'number.base': 'Total amount must be a number',
    'any.required': 'Total amount is required',
  }),
});

module.exports = { bookingSchema };
