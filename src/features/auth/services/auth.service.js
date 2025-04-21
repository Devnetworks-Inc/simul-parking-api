const { NotAuthorizedError } = require('../../../libs/core/error/custom-error');
const APP_MESSAGES = require('../../../shared/messages/app-messages');
const BaseAPIService = require('../../../shared/services/base-api.service');
const { AuthAdapter } = require('../adapters/auth-adapter');
const { AccountEntity } = require('../schemas/auth.entity');
const bcrypt = require('bcrypt');

class AuthService {
  constructor() {
    this._adapter = new AuthAdapter();
    this._baseService = new BaseAPIService(AccountEntity);
  }

  async findByEmail(email, role) {
    const filter = {
      email: email?.toLowerCase(),
      role: role,
      isArchived: false
    }
    return await this._baseService.getOne(filter);
  }

  async createAccount(model) {
    const result = this._adapter.adapt(model);
    const user = await this._baseService.create(result);
    model.accountId = user?.id
    return user
  }

  async checkUserEmailPassword(auth) {
    const { email, password, role } = auth;
    const user = await AccountEntity.findOne({
      where: { email: email?.toLowerCase(), role: role?.toLowerCase(), isArchived: false },
      nest: true
    });
    // guard clause
    if (!user) throw new NotAuthorizedError(APP_MESSAGES.USER_NOT_FOUND);

    if (user.validPassword(password)) return user;

    throw new NotAuthorizedError(APP_MESSAGES.INVALID_EMAIL);
  }

  async updateModel(id, model) {
    const result = await AccountEntity.findById(id);
    if (!result) return null;
    const updated = this._adapter.adaptToExisting(model, result);
    return this._baseService.update(result.id, updated);
  }

  async updatePassword(id, updatedItem) {
    const user = await AccountEntity.findOne({ id, isArchived: false });
    if (!user) throw new NotAuthorizedError(APP_MESSAGES.USER_NOT_FOUND);

    if (!user.validPassword(updatedItem.currentPassword)) {
      throw new NotAuthorizedError(APP_MESSAGES.INVALID_CURRENT_PASSWORD);
    }

    // Update the password
    const salt = await bcrypt.genSaltSync(10, 'a');
    const hashedPassword = bcrypt.hashSync(updatedItem.newPassword, salt);
    user.password = hashedPassword;

    // Save the updated user entity
    await user.save();

    return { message: APP_MESSAGES.PASSWORD_UPDATED_SUCCESSFULLY };
  }

  async setArchived(id) {
    const result = await AccountEntity.findById(id);
    if (!result) return undefined;
    return this._baseService.delete(id);
  }
}

module.exports = { AuthService };
