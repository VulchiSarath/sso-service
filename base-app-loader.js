'use strict';

let Hapi = require('@hapi/hapi'),
  _ = require('lodash'),
  fs = require('fs'),
  Errors = require('./lib/common/errors');

class BaseAppLoader {

  constructor(dependencies = {}, repoInfo) {
    let me = this;
    me.cwd = process.cwd();
    me.applicationData = {
      dependencies: dependencies,
      serverObjects: {}
    };
    me.repoInfo = repoInfo;
  }

  async bootUpApp() {
    let me = this;
    try {
      await me.fetchConfig();
      me.updateConfigAndDependencies();
      await me.createHapiServerInstances();
      me.registerAuthStrategies();
      await me.registerPublicRoutes();
      await me.startServers();
    }
    catch (err) {
      throw err;
    }
  }
 

  async createHapiServerInstances() {
    let me = this;
    for (const instanceConfig of me.applicationData.config.server.instances) {
      let server = new Hapi.server({
        port: instanceConfig.port,
        routes: {
          validate: {
            failAction: async (request, h, err) => {
              if (err.isJoi) {
                return h.response(err.output.payload)
                  .code(400)
                  .takeover();
              }
              return h.response(err).takeover()
            }
          }
        }
      });
      let plugins = me.getSpecificPlugins(instanceConfig, me.applicationData.config, me.applicationData.dependencies);
      await server.register(plugins);

      me.applicationData.serverObjects[instanceConfig.label] = server;
    }
  }

  registerAuthStrategies() {
    let me = this;
    _.each(_.values(me.applicationData.serverObjects), (serverObject) => {
      me.registerSpecificStrategies(serverObject, me.applicationData.dependencies, me.applicationData.config);
    })
  }
  async registerPublicRoutes() {
    let me = this;
    let routeFile = `${me.cwd}/lib/routes/register-public-routes`;
    if (fs.existsSync(`${routeFile}.js`)) {
      let RegisterRoutes = require(routeFile);
      let routes = new RegisterRoutes(me.applicationData.dependencies, me.applicationData.config);
      let server = me.applicationData.serverObjects['public']
      await routes.init(server);
      routes.registerRoutes(server);
    }
  }


  async startServers() {
    let me = this;
    let firstServer = _.first(_.values(me.applicationData.serverObjects));
    _.tail(_.values(me.applicationData.serverObjects)).forEach(function (serverObj) {
      firstServer.control(serverObj);
    });
    await firstServer.start();
  }
  

  /**
  * This method replies success back to the hapi reply.  If the message object has a statusCode, then use that.
  * @memberof BaseHelper
  * @param {string} h Hapi response toolkit
  * @param {object} message The message in the response.
  */
  replySuccess(h, message) {
    let statusCode = 200;
    if (message && message.statusCode) {
      statusCode = message.statusCode
    }
    return h.response(message).code(statusCode);
  }

  /**
  * This method replies an error back to the hapi reply.  If the error object has a statusCode, then use that.  Otherwise, a 500 will be used.
  * @memberof BaseHelper
  * @param {string} h Hapi response tool kit
  * @param {object} error The error in the response.
  * @param {options} error Options.  options.returnRawJSON is the flag to return raw JSON.
  */
  replyError(h, error, options) {
    const returnRawJSON = options && options.returnRawJSON ? options.returnRawJSON : false;
    if (!error.statusCode && !error.status) {
      error = Errors.UnexpectedErrorOccurred;
    }
    return h.response(returnRawJSON ? error : JSON.stringify(error)).code(error.statusCode || error.status || 500);
  }

}

module.exports = BaseAppLoader;
