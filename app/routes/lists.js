let router = require('express').Router()
let { Board } = require('../models/board')
let { Task } = require('../models/task')

/**
* CREATE list
*/

router.post('/', (req, res, next) => {
  Board.findById(req.body.board_id, (err, board) => {
    if (err || !board) return next(err)

    if (!_.find(board.users, { _id: req.user.id })) {
      return next(_.$err('denied'))
    }

    let list = board.lists.create({
      title: req.body.title,
      position: req.body.position
    })

    board.lists.push(list)

    board.save((err, board) => {
      if (err) return next(err)
      res.json({ data: list })
    })
  })
})

/**
* UPDATE list
*/

router.put('/:id', (req, res, next) => {
  Board.findById(req.body.board_id, (err, board) => {
    if (err || !board) return next(err)

    if (!_.find(board.users, { _id: req.user.id })) {
      return next(_.$err('denied'))
    }

    let list = board.lists.id(req.params.id)
    if (!list) return next()
    list.set(req.body)

    board.save((err, board) => {
      if (err) return next(err)
      res.json({ data: list })
    })
  })
})

/**
* DELETE list and associated tasks:comments
*/

router.delete('/:id', (req, res, next) => {
  Board.findById(req.body.board_id, (err, board) => {
    if (err || !board) return next(err)

    if (!_.find(board.users, { _id: req.user.id })) {
      return next(_.$err('denied'))
    }

    let list = board.lists.pull(req.params.id)

    board.save((err, board) => {
      if (err) return next(err)

      Task.find({ list_id: list._id }).remove((err, tasks) => {
        if (err) return next(err)
        res.json({ data: list })
      })
    })
  })
})

module.exports = router
