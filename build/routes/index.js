'use strict';

var protectedRoutes = require('express').Router();
var nonProtectedRoutes = require('express').Router();

_.each(['settings', 'projects', 'boards', 'lists', 'tasks', 'comments'], function (name) {
  protectedRoutes.use('/' + name, require('./' + name));
});

nonProtectedRoutes.use('/auth', require('./auth'));

module.exports = {
  protectedRoutes: protectedRoutes,
  nonProtectedRoutes: nonProtectedRoutes
};