const Joi = require('joi');
const { isMatch } = require('date-fns');

const routeSchema = Joi.object({
  
  type: Joi.string().valid('airport-parking', 'parking-airport').required(),

  parking: Joi.string().length(24).hex().required().messages({
    'any.required': 'Parking ID is required',
    'string.length': 'Parking ID must be a 24-character hex string',
    'string.hex': 'Parking ID must be a valid MongoDB ObjectId'
  }),

  airport: Joi.string().required().messages({
    'any.required': 'Airport is required'
  })
})

module.exports = { routeSchema };
