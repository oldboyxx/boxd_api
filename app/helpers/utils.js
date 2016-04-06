let mongoose = require('mongoose')

_.mixin({ $err(msg, status=500) {
  if (msg === 'denied') {
    msg = "You aren't authorized to access this route."
    status = 403

  } else if (/:null/.test(msg)) {
    msg = _.capitalize(msg.split(':')[0]) + " not found."
    status = 404
  }

  let err = new Error(msg)
  err.status = status
  return err
}})

_.mixin({ $upsert(arr, matchVal, newVal) {
  if (_.isObject(arr[0])) {
    var index = _.indexOf(arr, _.find(arr, matchVal))
  } else {
    var index = _.indexOf(arr, matchVal)
  }

  if (index > -1) {
    arr.splice(index, 1, newVal)
  } else {
    arr.push(newVal)
  }
}})

_.mixin({ $toObjectId(str) {
  return mongoose.Types.ObjectId(str)
}})
