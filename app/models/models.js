let mongoose = require('mongoose')
let models = {}

_.each(['user', 'project', 'board', 'task'], (name) => {
  let cName = _.capitalize(name)
  models[cName] = mongoose.model(cName, require('../schemas/'+name))
})

module.exports = models