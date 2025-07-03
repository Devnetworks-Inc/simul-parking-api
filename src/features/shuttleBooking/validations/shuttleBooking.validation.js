const Joi = require('joi');
const { idSchema } = require('../../../shared/schema');
const { isMatch } = require('date-fns');

const datetimeStringValidation = (value, helpers) => {
  if (!isMatch(value, 'yyyy-MM-dd HH:mm')) {
    return helpers.error('any.invalid');
  }
  return value;
};

const dateStringValidation = (value, helpers) => {
  if (!isMatch(value, 'yyyy-MM-dd')) {
    return helpers.error('any.invalid');
  }
  return value;
};

const shuttleBookingSchema = Joi.object({
  firstName: Joi.string().required().messages({
    'string.base': 'First Name must be a string',
    'string.empty': 'First Name is a required field',
    'any.required': 'First Name is a required field',
  }),

  lastName: Joi.string().required().messages({
    'string.base': 'Last Name must be a string',
    'string.empty': 'Last Name is a required field',
    'any.required': 'Last Name is a required field',
  }),

  pickupAddress: Joi.string().required().messages({
    'string.base': 'Pickup Address must be a string',
    'string.empty': 'Pickup Address is a required field',
    'any.required': 'Pickup Address is a required field',
  }),

  destinationAddress: Joi.string().required().messages({
    'string.base': 'Destination Address must be a string',
    'string.empty': 'Destination Address is a required field',
    'any.required': 'Destination Address is a required field',
  }),

  pickupDatetime: Joi.string().custom(datetimeStringValidation, 'custom validation').required().messages({
    'any.required': 'Pickup Datetime is required',
    'any.invalid': 'Pickup Datetime format must be "yyyy-MM-dd HH:mm"'
  }),

  price: Joi.number().required().messages({
    'number.base': 'price must be a number',
    'any.required': 'price is a required field',
  }),

  note: Joi.string().optional().messages({
    'string.base': 'Note must be a string',
  }),

  seats: Joi.number().required().messages({
    'number.base': 'Seats must be a number',
    'any.required': 'Seats is a required field',
  }),

  parkingBookingId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required().messages({
    'string.base': 'Parking Booking Id must be a string',
    'string.empty': 'Parking Booking Id is a required field',
    'any.required': 'Parking Booking Id is a required field',
    'string.pattern.base': 'Parking Booking Id must be a valid Object ID'
  }),
  parkingId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required().messages({
    'string.base': 'Parking Id must be a string',
    'string.empty': 'Parking Id is a required field',
    'any.required': 'Parking Id is a required field',
    'string.pattern.base': 'Parking Id must be a valid Object ID'
  }),
  route: Joi.string().valid('airport-parking', 'parking-airport').required(),
  airportGate: Joi.string().required(),
})

const idParamSchema = Joi.object({
  id: idSchema.messages({
    'string.pattern.base': 'Id must be a valid Object ID'
  })
})

const timetableQuerySchema = Joi.object({
  date: Joi.string().custom(dateStringValidation, 'custom validation').required().messages({
    'string.empty': 'Date is a required field',
    'any.required': 'Date is a required field',
    'any.invalid': 'Date format must be "yyyy-MM-dd"'
  }),
  route: Joi.string().valid('airport-parking', 'parking-airport')
})

const shuttleBookingGetAllFilter = Joi.object({
  startDate: Joi.date(),
  endDate: Joi.date(),
  route: Joi.string().valid('airport-parking', 'parking-airport')
})

module.exports = { shuttleBookingSchema, idParamSchema, timetableQuerySchema, shuttleBookingGetAllFilter };
