// Don't worry, lodash is the ONLY global var
global._ = require('lodash')

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

let getIndex = (arr, val, matchVal) => {
  matchVal = matchVal ? _.find(arr, matchVal) : val
  let index = _.indexOf(arr, matchVal)
  return { arr, val, index }
}

_.mixin({ $update(...args) {
  let { arr, val, index } = getIndex(...args)
  if (index > -1) arr.splice(index, 1, val)
}})

_.mixin({ $upsert(...args) {
  let { arr, val, index } = getIndex(...args)
  index > -1 ? arr.splice(index, 1, val) : arr.push(val)
}})

let mongoose = require('mongoose')
_.mixin({ $toObjId(id) {
  return mongoose.Types.ObjectId(id)
}})
