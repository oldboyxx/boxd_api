'use strict';

require('./utils/lodash');

var mongoose = require('mongoose');
var config = require('../config');

// Configure debugging

if (process.env.NODE_ENV === 'development') {
  mongoose.set('debug', true);
}

// Connect to database and start app

mongoose.connect(config.dbPath, function (err) {
  if (err) throw err;
  require('./app').start();
});