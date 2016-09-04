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

var getIndex = function getIndex(arr, val, matchVal) {
  matchVal = matchVal ? _.find(arr, matchVal) : val;
  var index = _.indexOf(arr, matchVal);
  return { arr: arr, val: val, index: index };
};

_.mixin({
  $update: function $update() {
    var _getIndex = getIndex.apply(undefined, arguments);

    var arr = _getIndex.arr;
    var val = _getIndex.val;
    var index = _getIndex.index;

    if (index > -1) arr.splice(index, 1, val);
  }
});

_.mixin({
  $upsert: function $upsert() {
    var _getIndex2 = getIndex.apply(undefined, arguments);

    var arr = _getIndex2.arr;
    var val = _getIndex2.val;
    var index = _getIndex2.index;

    index > -1 ? arr.splice(index, 1, val) : arr.push(val);
  }
});

var mongoose = require('mongoose');
_.mixin({
  $toObjId: function $toObjId(id) {
    return mongoose.Types.ObjectId(id);
  }
});