let router = require('express').Router()

let routes = ['users', 'projects', 'boards', 'lists', 'tasks', 'comments']

_.each(routes, (name) => {
  router.use('/'+name,  require('./'+name))
})

module.exports = router
