'use strict';

var util = require('util'),
    fs = require('fs'),
    _ = require('lodash'),
    url = require('url'),
    glob = require('glob'),
    path = require('path');


util._ = _;
util.fs = fs;
util.url = url;
util.path = path;


/**
 * findPackage - give a directory, it turns it and it's content into a js object
 * @param {string} searchDir
 * @return {object}
 */
util.findPackage = function (searchDir) {
    var packageRoot = {},
        files = glob.sync(path.join(searchDir, '**/*.js'));

    _.forEach(files, function (file) {
        var cleanName = _.camelCase(path.basename(file, path.extname(file)));

        // find the place in the package structure
        var currentLevel = packageRoot,
            subLevels = _.trimLeft(path.dirname(file), searchDir);
        if (subLevels) {
            subLevels = _.without(subLevels.split(path.sep), '');

            _.forEach(subLevels, function (subLevel) {
                if (!currentLevel[subLevel]) {
                    currentLevel[subLevel] = {};
                }
                currentLevel = currentLevel[subLevel];
            });
        }

        // add the module
        currentLevel[cleanName] = require(file);
    });

    return packageRoot;
};

/**
 * jsonCopy - if a plain object make a deep copy / hacky
 * @param json
 * @returns {*|number}
 */
util.jsonCopy = function (json) {
    if (_.isPlainObject(json)) {
        return JSON.parse(JSON.stringify(json));
    }
};

util.prependUri = function (string, uri) {
    var stringPattern = new RegExp('^\/.+\/$'),
        uriPattern = new RegExp(('^\/'));

    if (string === '' || string === null || uri === '' || uri === null) {
        return null;
    }

    if (uri.match(uriPattern)) {
        uri = uri.substring(1);
    }

    switch (string) {
        case string.match(stringPattern):
            break;
        case string.indexOf('/') === 0:
            string = string + '/';
            break;
        case string.indexOf('/') === string.length - 1:
            string = '/' + string;
            break;
        default:
            string = '/' + string + '/';
            break;
    }

    return url.resolve(string, uri);
};

module.exports = util;
