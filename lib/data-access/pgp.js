const pgp = require("pg-promise")(),
    fs = require('fs'),
    _ = require('lodash');

let _pgp;
module.exports = {
    db: function (connection, maxPoolSize = 20, minPoolSize = 0) {
        _pgp = pgp({
            connectionString: connection,
            max: maxPoolSize,
            min: minPoolSize
        });

        return _pgp;
    }
};