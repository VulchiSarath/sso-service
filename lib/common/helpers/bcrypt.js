const bcrypt = require('bcrypt'),
  saltRounds = 10,
  _ = require('lodash'),
  Error = require('../errors');

module.exports =  {

  async encryptPayload(payload) {
    try {
      return await bcrypt.hash(payload, saltRounds);
    } catch (error) {
      throw error;
    }
  },

  async hashCompare(password, encrypted_password) {
    try {
      const decrypt = await bcrypt.compare(password, encrypted_password);
      if(!decrypt){
        throw Error.UnAuthorized;
      }
      return decrypt;
    } catch (error) {
      throw error;
    }
  }
}
