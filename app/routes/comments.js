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
  comment.updateComment,
  $.saveItem('task'),
  $.respond('omit:task')
)

router.delete('/:id',
  $.getItem('task'),
  comment.deleteComment,
  $.saveItem('task'),
  $.respond('omit:task')
)

module.exports = router
