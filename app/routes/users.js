let router = require('express').Router()
let { $ } = require('../models/user')

router.post('/',
  $.createUser
)

router.get('/',
  $.validateAdmin,
  $.getUsers
)

router.get('/:id',
  $.validateAdmin,
  $.getUser
)

router.put('/:id',
  $.validateSelf,
  $.updateUser
)

module.exports = router
