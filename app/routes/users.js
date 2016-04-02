let router = require('express').Router()
let { user, shared: $ } = require('../models')

router.post('/',
  user.createUser
)

router.get('/',
  $.validateAdmin,
  $.getItems('user'),
  $.respond()
)

router.get('/:id',
  $.validateAdmin,
  $.getItem('user'),
  $.respond()
)

router.put('/:id',
  $.validateSelf,
  user.updateUser
)

module.exports = router
