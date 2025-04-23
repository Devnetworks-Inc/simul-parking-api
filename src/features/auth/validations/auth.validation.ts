const Joi = require('joi');

export const authSchema = Joi.object({
  email: Joi.string().required().messages({
    'string.base': 'email must be of type string',
    'string.empty': 'email is a required field'
  }),
  password: Joi.string().messages({
    'string.base': 'password must be of type string',
    'string.empty': 'password is a required field'
  })
});