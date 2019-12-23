'use strict'

const BaseAppLoader = require('../../base-app-loader'),
  SSOService = require('../service/sso-service'),
  co = require('co');

class SSORouteHandler extends BaseAppLoader {
  constructor(dependencies, config) {
    super(dependencies, config);
    this.config = config;
  }

  signUp(request, reply) {
    const me = this;
    return co(function* () {
      const ssoService = new SSOService(me.applicationData.dependencies, me.config, request);
      const result = yield ssoService.signUp(request.payload);
      return me.replySuccess(reply, result);
    }).catch(function (error) {
      return me.replyError(reply, error);
    });
  }

  signIn(request, reply) {
    const me = this;
    return co(function* () {
      const ssoService = new SSOService(me.applicationData.dependencies, me.config, request);
      const result = yield ssoService.signIn(request.payload);
      return me.replySuccess(reply, result);
    }).catch(function (error) {
      return me.replyError(reply, error);
    });
  }

  user(request, reply) {
    const me = this;
    return co(function* () {
      const ssoService = new SSOService(me.applicationData.dependencies, me.config, request);
      const result = yield ssoService.user(request.query.page, request.query.limit);
      return me.replySuccess(reply, result);
    }).catch(function (error) {
      return me.replyError(reply, error);
    });
  }
  userSearch(request, reply) {
    const me = this;
    return co(function* () {
      const ssoService = new SSOService(me.applicationData.dependencies, me.config, request);
      const result = yield ssoService.userSearch(request.query);
      return me.replySuccess(reply, result);
    }).catch(function (error) {
      return me.replyError(reply, error);
    });
  }
  
  
}

module.exports = SSORouteHandler;
