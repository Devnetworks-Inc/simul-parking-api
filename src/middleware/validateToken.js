const { expressjwt } = require("express-jwt")
const { config } = require("../configs/config")

const jwtSecret = config.JWT_TOKEN || ''
const validateToken = expressjwt({ secret: jwtSecret, algorithms: ["HS256"] })

module.exports = validateToken