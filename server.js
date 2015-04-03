'use strict';

var util = require('./core/util'),
    nconf = require('nconf'),
    mongoose = require('mongoose'),
    errors = require('restify').errors;

module.exports.util = util;
module.exports.config = nconf;
module.exports.mongoose = mongoose;
module.exports.controllers = util.findPackage(util.path.join(__dirname, 'controllers'));
module.exports.errors = errors;

/**
 * bootstrap - sets up a server for a project.
 * @param {object} config - current properties name & version
 * @param {function} callback - callback at end of setup
 * @returns {*}
 */
module.exports.bootstrap = function (config, initializer, callback) {
    var server = require('./core/server')(config, initializer, callback),

        connectionString = nconf.get('DB_URI'); // set in app configs

    if (connectionString) {
        mongoose.connect(connectionString);
    }

    return server;
};
