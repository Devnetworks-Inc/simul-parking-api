const Joi = require('joi');
const { isMatch } = require('date-fns');

const timeStringValidation = (value, helpers) => {
  if (!isMatch(value, 'HH:mm')) {
    return helpers.error('any.invalid');
  }
  const [h, m] = value.split(':')
  if (h.length !== 2 || m.length !== 2) {
    return helpers.error('any.invalid');
  }
  return value;
};

const timetableSchema = Joi.object({
  time: Joi.string().custom(timeStringValidation, 'custom validation').required().messages({
    'any.required': 'Time is required',
    'any.invalid': 'Time format must be "HH:mm"'
  }),

  route: Joi.string().valid('airport-parking', 'parking-airport').required(),

  parking: Joi.string().length(24).hex().required().messages({
    'any.required': 'Parking ID is required',
    'string.length': 'Parking ID must be a 24-character hex string',
    'string.hex': 'Parking ID must be a valid MongoDB ObjectId'
  }),

  airport: Joi.string().required().messages({
    'any.required': 'Airport is required'
  })
})

module.exports = { timetableSchema };
