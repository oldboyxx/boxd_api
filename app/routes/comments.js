let router = require('express').Router()
let { comment, shared: $ } = require('../models')

router.post('/',
  $.getItem('task'),
  $.getItem('board', '$.task.board_id'),
  $.validateAccess(),
  comment.createComment,
  $.respond('omit:board:task')
)

router.put('/:id',
  $.getItem('task'),
  $.getItem('board', '$.task.board_id'),
  $.validateAccess(),
  comment.updateComment,
  $.respond('omit:board:task')
)

router.delete('/:id',
  $.getItem('task'),
  $.getItem('board', '$.task.board_id'),
  $.validateAccess(),
  comment.deleteComment,
  $.respond('omit:board:task')
)

module.exports = router
