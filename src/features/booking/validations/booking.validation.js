const Joi = require('joi');
const { dateStringValidation, idSchema } = require('../../../shared/schema');

const parkingSpaceLocation = Joi.string().optional().messages({
  'string.base': 'Parking Space Location must be a string',
})

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
  startDate: Joi.string()
  .custom(dateStringValidation, 'custom validation')
  .required().messages({
    'any.required': 'Start date is required',
    'any.invalid': 'Start Date format must be "yyyy-MM-dd HH:mm"'
  }),
  // startTime: Joi.date().required().messages({
  //   'date.base': 'Start time must be a valid date',
  //   'any.required': 'Start time is required',
  // }),
  endDate: Joi.string()
  .custom(dateStringValidation, 'custom validation')
  .required().messages({
    'date.base': 'End date must be a valid date',
    'any.required': 'End date is required',
    'any.invalid': 'End Date format must be "yyyy-MM-dd HH:mm"'
  }),
  // endTime: Joi.date().required().messages({
  //   'date.base': 'End time must be a valid date',
  //   'any.required': 'End time is required',
  // }),
  isServices: Joi.boolean().optional(),
  // totalAmount: Joi.number().required().messages({
  //   'number.base': 'Total amount must be a number',
  //   'any.required': 'Total amount is required',
  // }),
  parkingName: Joi.string().required().messages({
    'string.base': 'Parking Name must be a string',
    'string.empty': 'Parking Name is required',
    'any.required': 'Parking Name is a required field',
  }),
  parkingEstablishmentId: idSchema.required().messages({
    'string.base': 'Parking Id must be a string',
    'string.empty': 'Parking Id is a required field',
    'any.required': 'Parking Id is a required field',
    'string.pattern.base': 'Parking Id must be a valid Object ID'
  }),
  // parkingId: Joi.string().optional().messages({
  //   'string.base': 'Parking Id must be a string',
  //   'string.empty': 'Parking Id cannot be an empty string',
  // }),
  vehicleNumber: Joi.number(),
  brand: Joi.string(),
  parkingSpaceLocation,
  isVehiclePickedUp: Joi.boolean().optional(),
});

module.exports = { bookingSchema, parkingSpaceLocation };
