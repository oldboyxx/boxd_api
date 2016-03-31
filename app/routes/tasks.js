let router = require('express').Router()
let { Board } = require('../models/board')
let { Task } = require('../models/task')

/**
* GET SINGLE task with comments
*/

router.get('/:id', (req, res, next) => {
  Task.findById(req.params.id).lean().exec((err, task) => {
    if (err || !task) return next(err)

    Board.findById(task.board_id).lean().exec((err, board) => {
      if (err || !board) return next(err)

      if (!_.find(board.users, { _id: req.user.id })) {
        return next(_.$err('denied'))
      }

      res.json({ data: task })
    })
  })
})

/**
* CREATE task
*/

router.post('/', (req, res, next) => {
  Board.findById(req.body.board_id).lean().exec((err, board) => {
    if (err || !board) return next(err)

    if (!_.find(board.users, { _id: req.user.id })) {
      if (!_.find(board.lists, { _id: req.body.list_id })) {
        return next(_.$err('denied'))
      }
    }

    Task.create(req.body, (err, task) => {
      if (err) return next(err)
      res.json({ data: task })
    })
  })
})

/**
* UPDATE task
*/

router.put('/:id', (req, res, next) => {
  let r = req.body

  Task.findById(req.params.id, (err, task) => {
    if (err || !task) return next(err)

    Board.findById(task.board_id).lean().exec((err, board) => {
      if (err || !board) return next(err)

      if (!_.find(board.users, { _id: req.user.id })) {
        if (!_.find(board.lists, { _id: r.list_id })) {
          return next(_.$err('denied'))
        }
      }

      delete r.board_id // Protection
      task.set(r)

      task.save((err, task) => {
        if (err) return next(err)
        res.json({ data: task })
      })
    })
  })
})

/**
* DELETE task and associated comments
*/

router.delete('/:id', (req, res, next) => {
  Board.findById(req.body.board_id).lean().exec((err, board) => {
    if (err || !board) return next(err)

    if (!_.find(board.users, { _id: req.user.id })) {
      return next(_.$err('denied'))
    }

    Task.remove({ _id: req.params.id }, (err, task) => {
      if (err) return next(err)
      res.json({ data: task })
    })
  })
})

module.exports = router
