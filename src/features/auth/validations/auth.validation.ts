const Joi = require('joi');

export const authSchema = Joi.object({
  username: Joi.string().required().messages({
    'string.base': 'boardName must be of type string',
    'string.empty': 'boardName is a required field'
  }),
  email: Joi.string().required().messages({
    'string.base': 'email must be of type string',
    'string.empty': 'email is a required field'
  }),
  password: Joi.string().messages({
    'string.base': 'password must be of type string',
    'string.empty': 'password is a required field'
  }),
  profileAvatar: Joi.string(),
  isActive: Joi.boolean().messages({
    'string.base': 'isActive must be of type boolean'
  })
});

// module.exports = { authSchema };
