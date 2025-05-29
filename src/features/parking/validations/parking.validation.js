const Joi = require('joi');

const parkingSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.base': 'name must be a string',
    'string.empty': 'name is a required field',
    'any.required': 'name is a required field',
  }),

  rating: Joi.string().optional().allow(null, '').messages({
    'string.base': 'rating must be a string',
  }),

  transferTime: Joi.string().optional().allow(null, '').messages({
    'string.base': 'transferTime must be a string',
  }),

  description: Joi.string().optional().allow(null, '').messages({
    'string.base': 'description must be a string',
  }),

  price: Joi.number().required().messages({
    'number.base': 'price must be a number',
    'any.required': 'price is a required field',
  }),

  tags: Joi.array().items(Joi.string()).optional().messages({
    'array.base': 'tags must be an array of strings',
    'string.base': 'each amenity must be a string',
  }),
  address: Joi.string().required().messages({
    'any.required': 'address is a required field',
  }),
  img: Joi.string()
});

module.exports = { parkingSchema };
