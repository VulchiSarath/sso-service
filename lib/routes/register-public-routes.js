'use strict';
let _ = require('lodash'),
  SSORouteHandler = require('./sso-route-handler'),
  Schema = require('../schema/user-presenter-schema');

class RegisterPublicRoutes {
  constructor(dependencies, config) {
    this.config = config;
    this.dependencies = dependencies;
    this.repoConfig = this.config.app_config;
    this.config.appId = this.repoConfig.appId || 'sso';
    this.ssoRouteHandler = new SSORouteHandler(dependencies, this.repoConfig);
    
  }

  init() { }

  registerRoutes(server) {
    const me = this;
    server.log('Registering public routes for sso service');

    server.route({
      method: 'POST',
      path: '/v1/sso/signup',
      config: {
        handler: (request, reply) => me.ssoRouteHandler.signUp(request, reply),
        description: 'sso SignUp',
        validate: {
          payload: Schema.SignUpRequestSchema
        },
        response: {
          failAction: 'error'
        },
        state: {
          parse: false,
          failAction: 'log'
        }
      }
    });

    server.route({
      method: 'POST',
      path: '/v1/sso/signin',
      config: {
        handler: (request, reply) => me.ssoRouteHandler.signIn(request, reply),
        description: 'sso SignIn',
        validate: {
          payload: Schema.SignInRequestSchema
        },
        response: {
          failAction: 'error'
        },
        state: {
          parse: false,
          failAction: 'log'
        }
      }
    });

    server.route({
      method: 'GET',
      path: '/v1/sso/user',
      config: {
        auth: { strategy: 'jwt-auth', mode: 'required'},
        handler: (request, reply) => me.ssoRouteHandler.user(request, reply),
        description: 'get user list',
        validate: {
          query: {
            limit: Schema.GetUserLimitSchema,
            page: Schema.GetUserPageSchema
          }
        },
        response: {
          failAction: 'error'
        },
        state: {
          parse: false,
          failAction: 'log'
        }
      }
    });

    server.route({
      method: 'GET',
      path: '/v1/sso/user-search',
      config: {
        handler: (request, reply) => me.ssoRouteHandler.userSearch(request, reply),
        description: 'User list based on search',
        validate: {
        },
        response: {
          failAction: 'error'
        },
        state: {
          parse: false,
          failAction: 'log'
        }
      }
    });
    
  }
}

module.exports = RegisterPublicRoutes;
