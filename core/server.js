'use strict';

var http = require('http'),
    https = require('https'),
    restify = require('restify'),
    engine = require('../server'),
    util = require('./util'),
    nconf = require('nconf'),
    env = process.env.NODE_ENV || 'development',
    controllerUri = '/app/controllers',
    configPath = __dirname + '/config/environments/',
    appConfigPath = process.cwd() + '/config/environments/';

// Do not limit maxSocket connections
https.globalAgent.maxSockets = Infinity;
http.globalAgent.maxSockets = Infinity;

// do config loads.
nconf
    .env()
    .argv()
    .file(env, appConfigPath + env + '.json')
    .file('default', appConfigPath + 'default.json')
    .file(env + 'Engine', configPath + env + '.json')
    .file('defaultEngine', configPath + 'default.json');

/**
 *
 * @param {object} config - current properties name & version
 * @param {function} initializer - any initializations that need to occur before routes are built
 * @param {function} cb - callback at end of setup
 * @returns {*}
 */

module.exports = function (config, initializer, cb) {

    initializer = initializer || function () {};

    // check if server has been initialized
    if (typeof engine !== 'undefined' && typeof engine !== null) {

        config = config || {
            name: 'api',
            version: '1.0.0'
        };

        engine.server = restify.createServer(config);

        // Do server setups
        // TODO: Figure out appropriate setups.
        engine.server
            .use(restify.fullResponse())
            .use(restify.bodyParser())
            .use(restify.queryParser());

        initializer();

        // get controllers
        var controllers = util.findPackage(process.cwd() + controllerUri);

        // route controllers to routes
        require('./router')(controllers, engine.server);

        // start the server; listen on env.PORT (for heroku) or get config port
        engine.server.listen(process.env.PORT || nconf.get('SERVER_PORT'), function () {
            if (typeof cb === 'function') {
                cb();
            }
        });

        return engine.server;
    }
};
