const { isMatch } = require("date-fns");
const Joi = require("joi")

const idSchema = Joi.string().regex(/^[0-9a-fA-F]{24}$/)

const idParamSchema = Joi.object({
  id: idSchema.messages({
    'string.pattern.base': 'Id must be a valid Object ID'
  })
})


const dateStringValidation = (value, helpers) => {
  if (!isMatch(value, 'yyyy-MM-dd HH:mm')) {
    return helpers.error('any.invalid');
  }
  return value;
};

module.exports = {
  idSchema,
  dateStringValidation,
  idParamSchema
}