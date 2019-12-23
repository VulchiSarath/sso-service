'use strict'

const _ = require('lodash');

class UserDBAccessor {
  constructor(dependencies, config) {
    this.config = config;
    this.pgp = dependencies.pgp;
  }

  async save(values) {
    const me = this;
    try {
      let user = await me.pgp.any('INSERT INTO users VALUES ($1, $2, $3, $4)', [values._id, values.email_address, values.data, values.password_hash]);
      return user
    } catch (error) {
      throw error;
    }
  }

  async getByEmailAddress(email_address) {
    const me = this;
    try {
      return await me.pgp.any('SELECT * FROM users where email_address = $1', [email_address]);
    } catch (error) {
      throw error;
    }
  }

  async getUserList(offset = 0, limit = 10) {
    const me = this;
    try {
      return await me.pgp.any('SELECT data from users ORDER BY created_date DESC OFFSET $1 LIMIT $2', [offset, limit]);
    } catch (error) {
      throw error;
    }
  }

  async filter(params) {
    const me = this;
    try {
      let keys = _.keys(params);
      let query = 'SELECT data FROM users ';
      if(keys.length > 0){
        for (let i = 0; i < keys.length; i++) {
          if (i === 0) {
            query += `WHERE data->>'${keys[i]}'='${_.get(params, keys[i])}'`;
          } else {
            query += `AND data->>'${keys[i]}'='${_.get(params, keys[i])}'`;
  
          }
        }
        return await me.pgp.any(query);
      }
      return me.getUserList();
      
    } catch (error) {
      throw error;
    }
  }

}

module.exports = UserDBAccessor;
