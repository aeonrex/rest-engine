var util = require('../server').util,
    server = require('../server').server,
    version = require('../server').config.get('VERSION') || '',
    resources = require('../server').config.get('RESOURCES');

/**
 *
 * @param {string} r - route represented as a uri i.e: 'items/:id'
 * @param method
 * @param handler
 * @returns {*}
 */
function prepRoutes(r, method, handler) {
    r = util.prependUri(version, r);
    switch (method) {
        case 'GET':
            return server.get(r, handler);
        case 'POST':
            return server.post(r, handler);
        case 'PUT':
            return server.put(r, handler);
        case 'PATCH':
            return server.patch(r, handler);
        case 'DELETE':
            return server.del(r, handler);
        case 'HEAD':
            return server.head(r, handler);
        case 'OPTIONS':
            return server.opts(r, handler);
        default:
            break;
    }
}


module.exports = function (controllers) {
    util._.forEach(resources, function (resource) {

        if (!resource.CONTROLLER || !resource.ROUTES) {
            console.error('Malformed route configurations... skipping');
            return;
        }

        var controller = controllers[resource.CONTROLLER];
        if (controller) {
            for (var r in resource.ROUTES) {
                if (resource.ROUTES.hasOwnProperty(r)) {
                    var route = resource.ROUTES[r];

                    if (Array.isArray(route)) {
                        util._.forEach(route, function (element) {
                            prepRoutes(r, element.METHOD, controller[element.VALUE])
                        });
                    } else {
                        prepRoutes(r, route.METHOD, controller[route.VALUE]);
                    }
                }
            }
        }
    });
};
