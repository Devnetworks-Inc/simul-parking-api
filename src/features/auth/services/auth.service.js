const { BadRequestError } = require("../../../libs/core/error/custom-error");
const APP_MESSAGES = require("../../../shared/messages/app-messages");
const BaseAPIService = require("../../../shared/services/base-api.service");
const { AuthAdapter } = require("../adapters/auth-adapter");
const { AccountEntity } = require("../schemas/auth.entity");

class AuthService {
  constructor() {
    this._adapter = new AuthAdapter();
    this._baseService = new BaseAPIService(AccountEntity);
  }

  async findByEmail(email) {
    const filter = {
      email: email?.toLowerCase(),
    };
    return await this._baseService.getOne(filter);
  }

  async createAccount(model) {
    const result = this._adapter.adapt(model);
    const user = await this._baseService.create(result);
    return user;
  }

  async checkUserEmailPassword(auth) {
    const { userName, password } = auth;
    // await this.createAccount(auth)
    const user = await AccountEntity.findOne({ userName });
    if (!user) throw new BadRequestError(APP_MESSAGES.USER_NOT_FOUND);

    if (user.validPassword(password)) return this._baseService._clean(user);

    throw new BadRequestError(APP_MESSAGES.INVALID_EMAIL);
  }
}

module.exports = { AuthService };
