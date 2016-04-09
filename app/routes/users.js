let router = require('express').Router()
let { user, shared: $ } = require('../models')

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

router.put('/settings',
  $.getItem('user', 'user.id'),
  $.updateItem('user'),
  $.saveItem('user'),
  $.respond()
)

module.exports = router
