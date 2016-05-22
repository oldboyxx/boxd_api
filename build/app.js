'use strict';

var app = require('express')();
var bodyParser = require('body-parser');
var config = require('../config');

var _require = require('./middleware');

var requestConfig = _require.requestConfig;
var authentication = _require.authentication;
var errorHandling = _require.errorHandling;
var development = _require.development;

var _require2 = require('./routes');

var protectedRoutes = _require2.protectedRoutes;
var nonProtectedRoutes = _require2.nonProtectedRoutes;


app.use(bodyParser.json({ type: '*/*' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(require('cors')());

app.use(requestConfig.prepare);
app.use(development.becomeDevUser);

app.use('/', nonProtectedRoutes);

app.use(/^((?!^\/auth\/).)*$/, authentication.validateTokenAndSetUser, authentication.returnCurrentUser);

app.use('/', protectedRoutes);

app.use(errorHandling.routeNotFound);
app.use(errorHandling.handleErrors);

module.exports = {
  start: function start() {
    app.listen(config.port);
    return app;
  }
};