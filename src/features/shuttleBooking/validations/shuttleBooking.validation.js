const Joi = require('joi');
const { idSchema } = require('../../../shared/schema');

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

  pickupDatetime: Joi.date().required().messages({
    'date.base': 'Pickup Datetime must be a valid date',
    'any.required': 'Pickup Datetime is required',
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
  })
})

const idParamSchema = Joi.object({
  id: idSchema.messages({
    'string.pattern.base': 'Id must be a valid Object ID'
  })
})

module.exports = { shuttleBookingSchema, idParamSchema };
