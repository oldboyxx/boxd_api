let router = require('express').Router()
let { user, shared } = require('../models')

router.post('/',
  user.createUser
)

router.get('/',
  shared.validateAdmin,
  user.getUsers
)

router.get('/:id',
  shared.validateAdmin,
  _.$args(shared.getItem, 'user'),
  shared.respond
)

router.put('/:id',
  shared.validateSelf,
  user.updateUser
)

module.exports = router
