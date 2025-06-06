const { isMatch } = require("date-fns");
const Joi = require("joi")

const idSchema = Joi.string().regex(/^[0-9a-fA-F]{24}$/)

const dateStringValidation = (value, helpers) => {
  if (!isMatch(value, 'yyyy-MM-dd HH:mm')) {
    return helpers.error('any.invalid');
  }
  return value;
};

module.exports = {
  idSchema,
  dateStringValidation
}