'use strict'

const BaseAppLoader = require('../../base-app-loader'),
  UserDBAccessor = require('../data-access/user-db-accessor'),
  Errors = require('../common/errors'),
  Success = require('../common/success'),
  Bcrypt = require('../common/helpers/bcrypt'),
  uuid = require('uuid'),
  Jwt = require('../common/helpers/jwt-token'),
  _ = require('lodash');

class SSOService extends BaseAppLoader {
  constructor(dependencies, config, requestContext) {
    super(dependencies, config, requestContext);
    this.userDBAccessor = new UserDBAccessor(dependencies, config);
    this.jwt = new Jwt(dependencies, config);
  }

  async signUp(payload) {
    const me = this;
    try {
      const user = await me.userDBAccessor.getByEmailAddress(payload.email_address);
      if (user.length > 0) {
        throw Errors.emailAlreadyExists;
      }
      const password_hash = await Bcrypt.encryptPayload(payload.password);
      let construtUserData = {
        _id: uuid.v4(),
        email_address: payload.email_address,
        data: {
          email_address: payload.email_address,
          first_name: payload.first_name,
          last_name: payload.last_name,
          date_of_birth: payload.date_of_birth,
          mobile: payload.mobile,
          city: payload.city,
          state: payload.state,
          country: payload.country,
          pin_code: payload.pin_code
        },
        password_hash: password_hash
      }
      await me.userDBAccessor.save(construtUserData);
      return Success.userCreatedSuccessfully;
    } catch (error) {
      throw error;
    }
  };

  async signIn(payload) {
    const me = this;
    try {
      const user = await me.userDBAccessor.getByEmailAddress(payload.email_address);
      if(user.length > 0) {
        const passwordHash = _.get(user, '0.password_hash');
        await Bcrypt.hashCompare(payload.password, passwordHash);
        const token = await me.jwt.sign({ email_address: payload.email_address, password_hash: passwordHash });
        return _.merge(Success.userLoggedIn, { token: token });
      }
      return Errors.invalidUser;
    } catch (error) {
      throw error;
    }
  };

  async user(page, limit) {
    const me = this;
    try {
      const offset = page * limit;
      const users = await me.userDBAccessor.getUserList(offset, limit);
      return _.map(users, 'data');
    } catch (error) {
      throw error;
    }
  }

  async userSearch(queryParams) {
    const me = this;
    try {
      const pick = _.pick(queryParams, ['email_address', 'first_name', 'last_name', 'mobile', 'date_of_birth', 'city', 'state', 'country', 'pin_code']);
      const users = await me.userDBAccessor.filter(pick);
      return _.map(users, 'data');
    } catch (error) {
      throw error;
    }
  }


}

module.exports = SSOService;
