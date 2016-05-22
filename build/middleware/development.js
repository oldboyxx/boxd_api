'use strict';

var config = require('../../config');

var _require = require('./authentication');

var createJWToken = _require.createJWToken;

var _require2 = require('../models/models');

var User = _require2.User;
var Project = _require2.Project;


function becomeDevUser(req, res, next) {
  if (process.env.NODE_ENV !== 'development' || !req.query.become_dev_user) return next();

  User.find({ email: config.devEmail }, function (err, users) {
    req.headers['x-jwtoken'] = createJWToken(users[0]);
    return next();
  });
}

module.exports = { becomeDevUser: becomeDevUser };