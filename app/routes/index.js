let router = require('express').Router()

_.each(['auth', 'users', 'projects', 'boards', 'lists', 'tasks', 'comments'], (name) => {
  router.use('/'+name,  require('./'+name))
})

module.exports = router
