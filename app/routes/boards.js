let router = require('express').Router()
let { Project } = require('../models/project')
let { Board } = require('../models/board')
let { Task } = require('../models/task')
let { User } = require('../models/user')

/**
* GET SINGLE board with lists and tasks
*/

router.get('/:id', (req, res, next) => {
  Board.findById(req.params.id).lean().exec((err, board) => {
    if (err || !board) return next(err)

    if (!_.find(board.users, { _id: req.user.id })) {
      return next(_.$err('denied'))
    }

    Task.find({ board_id: board._id }, '-desc -comments').lean().exec((err, tasks) => {
      if (err) return next(err)

      let taskUserIDs = _.flatMap(tasks, (t) => { return t.users })
      let boardUserIDs = _.map(board.users, (u) => { return u._id })
      let userIDs = _.uniq(taskUserIDs.concat(boardUserIDs))

      User.find({ _id: { $in: userIDs }}, '-email').lean().exec((err, users) => {
        if (err) return next(err)
        res.json({ data: { board, tasks, users }})
      })
    })
  })
})

/**
* CREATE board
*/

router.post('/', (req, res, next) => {
  Project.findById(req.body.project_id).lean().exec((err, project) => {
    if (err || !project) return next(err)

    if (!_.find(project.users, { _id: req.user.id })) {
      return next(_.$err('denied'))
    }

    req.body.users = [{ _id: req.user.id, admin: true }]
    req.body.lists = [] // Protection

    Board.create(req.body, (err, board) => {
      if (err) return next(err)
      res.json({ data: board })
    })
  })
})

/**
* UPDATE board
*/

router.put('/:id', (req, res, next) => {
  let r = req.body

  Board.findById(req.params.id, (err, board) => {
    if (err || !board) return next(err)

    if (!_.find(board.users, { _id: req.user.id, admin: true })) {
      return next(_.$err('denied'))
    }

    delete r.users // Protection
    delete r.lists // Protection
    delete r.project_id // Protection
    board.set(r)

    if (r.add_user_id) {
      let user = { _id: r.add_user_id, admin: r.admin }
      _.$upsert(board.users, { _id: r.add_user_id }, user)

    } else if (r.remove_user_id) {
      board.users.pull(r.remove_user_id)
    }

    board.save((err, board) => {
      if (err) return next(err)
      res.json({ data: board })
    })
  })
})

/**
* DELETE board and associated lists, tasks:comments
*/

router.delete('/:id', (req, res, next) => {
  Board.findById(req.params.id, (err, board) => {
    if (err || !board) return next(err)

    if (!_.find(board.users, { _id: req.user.id, admin: true })) {
      return next(_.$err('denied'))
    }

    board.remove((err, board) => {
      if (err) return next(err)

      Task.remove({ board_id: board._id }, (err, tasks) => {
        if (err) return next(err)
        res.json({ data: board })
      })
    })
  })
})

module.exports = router
