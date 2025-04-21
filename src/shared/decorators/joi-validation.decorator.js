const { JoiRequestValidationError } = require("../../libs/core/error/custom-error");

function joiValidation(schema) {
  return async function (req, res, next) {
    const { error } = schema.validate(req.body);
    if (error && error.details) {
      return next(new JoiRequestValidationError(error.details[0].message));
    }
    next();
  };
}

module.exports = joiValidation;
