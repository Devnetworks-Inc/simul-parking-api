const {
  ResponseHandler,
} = require("../../../libs/core/api-responses/response.handler");
const {
  DuplicateEntityError,
} = require("../../../libs/core/error/custom-error");
const APP_MESSAGES = require("../../../shared/messages/app-messages");
const TokenAuthService = require("../../../shared/services/jwt-token.service");
const { AuthAdapter } = require("../adapters/auth-adapter");
const { AccountEntity } = require("../schemas/auth.entity");
const { AuthService } = require("../services/auth.service");

class AuthController {
  constructor() {
    this._service = new AuthService();
    this._tokenService = new TokenAuthService();
    this._responseHandler = new ResponseHandler();
    this._adapter = new AuthAdapter();
  }

  async login(req, res) {
    const newItem = req.body;

    const createdItem = await this._service.checkUserEmailPassword(newItem);
    const tokenData = {
      id: createdItem.id,
      email: createdItem.email,
      role: createdItem.role,
    };
    const token = this._tokenService.generateToken(tokenData, "10d");
    const data = { ...createdItem, token };
    this._responseHandler.sendSuccess(res, data);
  }

  async create(req, res) {
    const authModel = req.body;
    const userResult = await this._service.findByEmail(authModel?.email);
    if (userResult)
      throw new DuplicateEntityError(APP_MESSAGES.EMAIL_ALREADY_EXISTS);

    const createdItem = await this._service.createAccount(authModel);

    const tokenData = {
      id: createdItem._id,
      email: createdItem.email,
      role: createdItem.role,
    };
    const token = this._tokenService.generateToken(tokenData, "10d");
    const data = { ...createdItem, token };

    this._responseHandler.sendCreated(res, data);
  }
}

module.exports = { AuthController };
