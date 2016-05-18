let router = require('express').Router()
let { user, shared: $ } = require('../models')

router.get('/',
  $.getItem('user', 'user.id'),
  $.respond()
)

router.put('/',
  $.getItem('user', 'user.id'),
  $.updateItem('user'),
  $.saveItem('user'),
  $.respond()
)

module.exports = router
