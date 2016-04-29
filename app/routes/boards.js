let router = require('express').Router()
let { board, shared: $ } = require('../models')

router.post('/',
  $.getItem('project'),
  $.validateAccess(),
  $.addFirstAdmin,
  $.createItem('board'),
  $.respond('omit:project')
)

router.get('/:id',
  $.getItem('board'),
  $.getItem('project', '$.board.project_id'),
  $.validateAccess(),
  board.setQueryArgs('lists'), $.getItems('list'),
  board.setQueryArgs('tasks'), $.getItems('task'),
  board.setQueryArgs('users'), $.getItems('user'),
  $.respond()
)

router.put('/:id',
  $.getItem('board'),
  $.validateAccess('admin'),
  $.updateItem('board', 'omit:users:project_id'),
  $.updateUserAdmin('board'),
  $.saveItem('board'),
  $.respond()
)

module.exports = router
