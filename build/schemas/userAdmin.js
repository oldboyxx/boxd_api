'use strict';

var Schema = require('mongoose').Schema;

var userAdminSchema = new Schema({
  _id: {
    type: String,
    required: true,
    trim: true
  },
  admin: {
    type: Boolean,
    required: true
  }
});

userAdminSchema.index({ '_id': 1 });

module.exports = userAdminSchema;