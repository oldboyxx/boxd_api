let router = require('express').Router()
let { task, shared: $ } = require('../models')

router.post('/',
  $.getItem('board'),
  $.validateAccess(),
  $.getItem('list'),
  task.validateListAccess,
  $.createItem('task'),
  $.respond('omit:board:list')
)

router.get('/:id',
  $.getItem('task'),
  $.getItem('board', '$.task.board_id'),
  $.validateAccess(),
  task.getUserIDs, $.getItems('user'),
  $.respond('omit:board')
)

router.put('/:id',
  $.getItem('task'),
  $.getItem('board', '$.task.board_id'),
  $.validateAccess(),
  $.getItem('list'),
  task.validateListAccess,
  $.updateItem('task', 'omit:board_id'),
  task.update,
  $.saveItem('task'),
  $.respond('omit:board:list')
)

module.exports = router
