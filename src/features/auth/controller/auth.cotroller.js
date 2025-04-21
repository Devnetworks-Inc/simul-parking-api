const { ResponseHandler } = require("../../../libs/core/api-responses/response.handler");
const { DuplicateEntityError, NotFoundError } = require("../../../libs/core/error/custom-error");
const APP_MESSAGES = require("../../../shared/messages/app-messages");
const TokenAuthService = require("../../../shared/services/jwt-token.service");
const { AuthAdapter } = require("../adapters/auth-adapter");
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
    const tokenData = { id: createdItem.id, email: createdItem.email, role: createdItem.role };
    const token = this._tokenService.generateToken(tokenData, '10d');
    const data = { ...createdItem, token }
    this._responseHandler.sendSuccess(res, data);
  }

  async create(req, res) {
    const authModel = req.body;
    const userResult = await this._service.findByEmail(authModel?.email, authModel?.role);
    if (userResult) throw new DuplicateEntityError(APP_MESSAGES.EMAIL_ALREADY_EXISTS);

    const createdItem = await this._service.createAccount(authModel);

    const tokenData = { id: createdItem.id, email: createdItem.email, role: createdItem.role };
    const token = this._tokenService.generateToken(tokenData, '10d');
    const data = { ...createdItem, token }

    this._responseHandler.sendCreated(res, data);
  }

  // Update Account Info
  async updateAccountInfo(req, res) {
    const id = req.params.id;
    const updatedItem = req.body;
    const updated = await this._service.updateModel(id, updatedItem);
    if (!updated) throw new NotFoundError(APP_MESSAGES.USER_NOT_FOUND);
    this._responseHandler.sendUpdated(res, updated);
  }

  async updatePassword(req, res) {
    const id = req.params.id;
    const updatedItem = req.body;
    const updated = await this._service.updatePassword(id, updatedItem);
    if (!updated) throw new NotFoundError(APP_MESSAGES.USER_NOT_FOUND);
    this._responseHandler.sendUpdated(res, updated);
  }
  async delete(req, res) {
    const id = req.params.id;
    const result = this._service.setArchived(id);
    if (!result) throw new NotFoundError(APP_MESSAGES.USER_NOT_FOUND);
    this._responseHandler.sendDeleted(res);
  }
}

module.exports = { AuthController };
