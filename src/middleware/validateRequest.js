const { ResponseHandler } = require("../libs/core/api-responses/response.handler");

const validateRequest = function({ bodySchema, paramsSchema, querySchema }) {
  const resHandler = new ResponseHandler()
  return function (req, res, next) {
    if (bodySchema) {
      const { error, value } = bodySchema.validate(req.body, { stripUnknown: true });
      if (error) {
        return resHandler.sendDynamicError(res, error.details[0].message, 400)
      }
      req.body = value
    }
    if (paramsSchema) {
      const { error, value } = paramsSchema.validate(req.params);
      if (error) {
        return resHandler.sendDynamicError(res, error.details[0].message, 400)
      }
      req.params = value
    }
    if (querySchema) {
      const { error, value } = querySchema.validate(req.query);
      if (error) {
        return resHandler.sendDynamicError(res, error.details[0].message, 400)
      }
      req.query = value
    }
    
    next()
  }
}

module.exports = {
  validateRequest
}