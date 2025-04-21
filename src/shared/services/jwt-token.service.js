const jwt = require('jsonwebtoken');
const { config } = require('../../configs/config');

class TokenAuthService {
  generateToken(user, expiryInDays) {

    const userObj = user;
    const token = jwt.sign(userObj, config.JWT_TOKEN, {
      expiresIn: expiryInDays
    });

    return token;
  }

  validateToken(tokenObj) {
    const { token } = tokenObj;
    return jwt.verify(token, config.JWT_TOKEN);
  }
}

module.exports = TokenAuthService;
