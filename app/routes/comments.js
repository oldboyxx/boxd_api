let router = require('express').Router()
let { comment, shared: $ } = require('../models')

router.post('/',
  $.getItem('task'),
  $.getItem('board', '$.task.board_id'),
  $.validateAccess(),
  comment.createComment,
  $.saveItem('task'),
  $.respond('omit:board')
)

router.put('/:id',
  $.getItem('task'),
  comment.updateComment,
  $.saveItem('task'),
  $.respond()
)

router.delete('/:id',
  $.getItem('task'),
  comment.deleteComment,
  $.saveItem('task'),
  $.respond()
)

module.exports = router
