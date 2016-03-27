let router = require('express').Router()

let routes = ['users', 'projects']

_.forEach(routes, (name) => {
  router.use('/'+name,  require('./'+name))
})

module.exports = router
