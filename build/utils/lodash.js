'use strict';

// Don't worry, lodash is the ONLY global var
global._ = require('lodash');

_.mixin({
  $err: function $err(msg) {
    var status = arguments.length <= 1 || arguments[1] === undefined ? 500 : arguments[1];

    if (msg === 'denied') {
      msg = "You aren't authorized to access this route.";
      status = 403;
    } else if (/:null/.test(msg)) {
      msg = _.capitalize(msg.split(':')[0]) + " not found.";
      status = 404;
    }

    var err = new Error(msg);
    err.status = status;
    return err;
  }
});

_.mixin({
  $upsert: function $upsert(arr, matchVal, newVal) {
    if (_.isObject(arr[0])) {
      var index = _.indexOf(arr, _.find(arr, matchVal));
    } else {
      var index = _.indexOf(arr, matchVal);
    }

    if (index > -1) {
      arr.splice(index, 1, newVal);
    } else {
      arr.push(newVal);
    }
  }
});

var mongoose = require('mongoose');
_.mixin({
  $toObjId: function $toObjId(id) {
    return mongoose.Types.ObjectId(id);
  }
});