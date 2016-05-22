let mongoose = require('mongoose')

mongoose.plugin(require('mongoose-timestamp'),  {
  createdAt: 'created_at',
  updatedAt: 'updated_at'
})

let models = {}
_.each(['user', 'project', 'board', 'list', 'task'], (name) => {
  let uName = _.upperFirst(name)
  models[uName] = mongoose.model(uName, require('../schemas/'+name))
})

module.exports = models