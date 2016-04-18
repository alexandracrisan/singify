'use strict';

const config = require('./index');

module.exports.init = function(app) {
    var routesPath = app.get('root') + '/app/routes';

    if (config.accessRoutes) {
        app.use('/', require(routesPath + '/account'));
    }
    //app.use('/', require(routesPath + '/authentication'));
    //app.use('/', require(routesPath + '/user'));
};
