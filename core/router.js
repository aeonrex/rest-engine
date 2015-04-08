var util = require('../server').util,
    server = require('../server').server,
    version = require('../server').config.get('VERSION') || '',
    resources = require('../server').config.get('RESOURCES');

/**
 *
 * @param {string} routeString - route represented as a uri i.e: 'items/:id'
 * @param method
 * @param handler
 * @returns {*}
 */
function prepRoutes(routeString, method, handler) {
    routeString = util.prependUri(version, routeString);
    switch (method) {
        case 'GET':
            return server.get(routeString, handler);
        case 'POST':
            return server.post(routeString, handler);
        case 'PUT':
            return server.put(routeString, handler);
        case 'PATCH':
            return server.patch(routeString, handler);
        case 'DELETE':
            return server.del(routeString, handler);
        case 'HEAD':
            return server.head(routeString, handler);
        case 'OPTIONS':
            return server.opts(routeString, handler);
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
