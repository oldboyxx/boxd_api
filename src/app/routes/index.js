let protectedRoutes = require('express').Router()
let nonProtectedRoutes = require('express').Router()

_.each(['settings', 'projects', 'boards', 'lists', 'tasks', 'comments'], (name) => {
  protectedRoutes.use('/'+name,  require('./'+name))
})

nonProtectedRoutes.use('/auth', require('./auth'))

module.exports = {
  protectedRoutes,
  nonProtectedRoutes
}
