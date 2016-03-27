/*let mongoose = require('mongoose')
let router = require('express').Router()
let { model: Board } = require('../models/board')

router.get('/', (req, res, next) => {
  Board.find({}, (err, boards) => {
    if (err) return next(err)
    res.json(boards)
  })
})

router.post('/', (req, res, next) => {
  req.body.users = [{ _id: req.body.user_id, admin: true }]

  Project.create(req.body, (err, project) => {
    if (err) return next(err)
    res.json(project)
  })
})

router.get('/:id', (req, res, next) => {
  Project.findById(req.params.id, (err, project) => {
    if (err || !project) return next(err)
    res.json(project)
  })
})

router.put('/:id', (req, res, next) => {
  let r = req.body

  Project.findById(req.params.id, (err, project) => {
    if (err || !project) return next(err)

    project.set(r)

    if (r.add_user_id) {

      let user = { _id: r.add_user_id, admin: r.admin }
      _.$upsert(project.users, { _id: r.add_user_id }, user)

    } else if (r.remove_user_id) {

      project.users.pull(r.remove_user_id)
    }

    project.save((err, project) => {
      if (err) return next(err)
      res.json(project)
    })
  })
})

module.exports = router
*/