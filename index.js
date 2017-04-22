// http://stackoverflow.com/questions/14934452/how-to-get-all-registered-routes-in-express/31501504#31501504

var Table = require('cli-table');

var routes = [];

// store all routers given to app.use
var routerMiddleware = [];

function beginRegisteringRoutes(app) {
    // monkey patch the `use` function to store the routers and the paths they operate on

    var oldUse = app.use;
    app.use = function() {
        var urlBase = arguments[0];

        if (arguments[1] && arguments[1].name == 'router') {
            var router = arguments[1];
            collectRoutesFromRouter(urlBase, router);
        }

        return oldUse.apply(this, arguments);
    };

    // find routes given app.get, app.post, etc.
    var methods = ['get', 'post', 'put', 'delete'];

    methods.forEach(function(method) {
        var oldFn = app[method];

        app[method] = function() {
            if (arguments.length >= 2) {
                var path = arguments[0];

                routes.push({
                    path: removeTrailingSlash(path),
                    method: method
                });
            }

            return oldFn.apply(this, arguments);
        };
    });
}

function collectRoutesFromRouter(pathBase, router) {
    router.stack.forEach(function(stackElement) {
        if (stackElement.route) {
            var path = pathBase + stackElement.route.path;
            var method = stackElement.route.stack[0].method.toUpperCase();

            routes.push({
                path: removeTrailingSlash(path),
                method: method
            });
        }
    });
}

function format(routes) {
    var table = new Table({ head: ['Method', 'Path'] });

    routes.forEach(function(route) {
        var _o = {};
        _o[route.method.toUpperCase()] = [route.path];
        table.push(_o);
    });

    return "(╯°□°）╯︵ ┻━┻\n" + table.toString();
}

// '/some/route/' -> '/some/route'
function removeTrailingSlash(path) {
    if (path != '/' && path.endsWith('/')) {
        return path.substring(0, path.length - 1);
    } else {
        return path;
    }
}

function print() {
    console.log(format(routes));
}

module.exports = {
    begin: beginRegisteringRoutes,
    print: print
};
