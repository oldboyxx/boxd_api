'use strict';

var mongoose = require('mongoose');

mongoose.plugin(require('mongoose-timestamp'), {
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

var models = {};
_.each(['user', 'project', 'board', 'list', 'task'], function (name) {
  var uName = _.upperFirst(name);
  models[uName] = mongoose.model(uName, require('../schemas/' + name));
});

module.exports = models;