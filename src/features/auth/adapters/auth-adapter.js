const { AccountEntity } = require("../schemas/auth.entity");

class AuthAdapter {
  adapt(item) {
    const { userName, email, password, role } = item;
    const result = new AccountEntity();
    result.userName = userName;
    result.email = email;
    result.password = password;
    result.role = role;
    return result;
  }

  adaptToExisting(item, model) {
    const { userName, email, password, role } = item;
    model.userName = userName ?? model.dataValues.userName;
    model.email = email ?? model.dataValues.email;
    model.password = password ?? model.dataValues.password;
    return model;
  }
}

module.exports = { AuthAdapter };
