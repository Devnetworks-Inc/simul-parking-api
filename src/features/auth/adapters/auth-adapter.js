const { AccountEntity } = require("../schemas/auth.entity");

class AuthAdapter {
  adapt(item) {
    const { firstName, lastName, phone, country, city, address, email, password, profileAvatar, role } = item;
    const result = new AccountEntity();
    result.firstName = firstName;
    result.lastName = lastName;
    result.phone = phone;
    result.country = country;
    result.city = city;
    result.address = address;
    result.email = email;
    result.password = password;
    result.profileAvatar = profileAvatar;
    result.role = role;
    return result;
  }

  adaptToExisting(item, model) {
    const { firstName, lastName, phone, country, city, address, email, password, profileAvatar, role } = item;
    model.firstName = firstName ?? model.dataValues.firstName;
    model.lastName = lastName ?? model.dataValues.lastName;
    model.phone = phone ?? model.dataValues.phone;
    model.country = country ?? model.dataValues.country;
    model.city = city ?? model.dataValues.city;
    model.address = address ?? model.dataValues.address;
    model.email = email ?? model.dataValues.email;
    model.password = password ?? model.dataValues.password;
    model.profileAvatar = profileAvatar ?? model.dataValues.profileAvatar;
    return model;
  }
}

module.exports = { AuthAdapter };
