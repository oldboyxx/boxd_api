'use strict';

var _require = require('./models');

var User = _require.User;

var createOnboardingProject = require('../utils/createOnboardingProject');

var actions = {
  createUser: function createUser(userObject, callback) {
    User.create(userObject, function (err, user) {
      if (err) return callback(err);
      createOnboardingProject(user.id, function () {
        callback(null, user);
      });
    });
  }
};

module.exports = actions;