'use strict'
let BaseAppLoader = require('./base-app-loader'),
  repoInfo = { name: 'sso' },
  pgp = require('./lib/data-access/pgp'),
  JwtAuth = require('./lib/common/auth'),
  dependencies = {};

class AppLoader extends BaseAppLoader {
  constructor() {
    super(dependencies, repoInfo);
  }

  updateConfigAndDependencies() {
    let me = this;
    me.applicationData.dependencies.pgp = pgp.db(me.applicationData.config.app_config.postgres.connectionstring, me.applicationData.config.app_config.postgres.poolSize);
  }

  getSpecificPlugins(instanceConfig, config, dependencies) {
    return [{
      plugin: JwtAuth,
      options: { dependencies: dependencies, config: config }
    }];
  }

  registerSpecificStrategies(server, dependencies, config) {
    server.auth.strategy('jwt-auth', 'jwt-auth', {
      dependencies: dependencies,
      config: config
    })
  }

  async fetchConfig() {
    this.applicationData.config = require('./config/config.json');
    return true;
  }

}

module.exports = AppLoader;
