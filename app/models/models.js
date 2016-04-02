let mongoose = require('mongoose')
let models = {}

_.each(['user', 'project', 'board', 'list', 'task', 'archievedProject', 'archievedBoard', 'archievedList', 'archievedTask'], (name) => {
  let cName = _.upperFirst(name)
  let lName = /arch/.test(name) ? _.lowerFirst(name.replace('archieved', '')) : name
  models[cName] = mongoose.model(cName, require('../schemas/'+lName)[name+'Schema'])
})

module.exports = models