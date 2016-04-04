let router = require('express').Router()
let { list, shared: $ } = require('../models')

router.post('/',
  $.getItem('board'),
  $.validateAccess(),
  $.createItem('list'),
  $.respond('omit:board')
)

router.put('/:id',
  $.getItem('list'),
  $.getItem('board', '$.list.board_id'),
  $.validateAccess(),
  $.updateItem('list', 'omit:board_id'),
  $.saveItem('list'),
  $.respond('omit:board')
)

module.exports = router
