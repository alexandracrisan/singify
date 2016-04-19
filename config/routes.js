'use strict';

const config = require('./index');

module.exports.init = function(app) {
    var routesPath = app.get('root') + '/app/routes';

    if (config.accessRoutes) {
        app.use('/', require(routesPath + '/account'));
    }
    app.get('*', function(req, res) {
        res.sendFile(app.get('root') + '/public/index.html');
    });
    //app.use('/', require(routesPath + '/authentication'));
    //app.use('/', require(routesPath + '/user'));
};
