// _ (lodash) is attached to GLOBAL in server.js
let mongoose = require('mongoose')

_.mixin({ $newErr(msg, status) {
  let err = new Error(msg)
  err.status = status
  return err
}})

_.mixin({ $err(name) {
  let arr = ["", 500]

  if (name === "notAuthorized") {
    arr = ["You aren't authorized to access this route.", 403]
  }
  return _.$newErr(...arr)
}})

_.mixin({ $upsert(arr, matchVal, newVal) {
  let match = _.find(arr, matchVal)
  if (match) {
    let index = _.indexOf(arr, match)
    arr.splice(index, 1, newVal)
  } else {
    arr.push(newVal)
  }
}})

_.mixin({ $toObjectId(str) {
  return mongoose.Types.ObjectId(str)
}})
