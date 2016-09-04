'use strict';

var Schema = require('mongoose').Schema;

var labelSchema = new Schema({
  title: {
    type: String,
    maxlength: 100,
    trim: true
  },
  color: {
    type: String,
    required: true,
    maxlength: 7,
    trim: true
  }
});

module.exports = labelSchema;