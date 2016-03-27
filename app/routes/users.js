let router = require('express').Router()
let { model: User } = require('../models/user')

router.get('/', (req, res, next) => {
  User.find({}, (err, users) => {
    if (err) return next(err)
    res.json({ data: users })
  })
})

router.get('/:id', (req, res, next) => {
  User.findById(req.params.id, (err, user) => {
    if (err || !user) return next(err)
    res.json({ data: user })
  })
})

router.post('/', (req, res, next) => {
  User.create(req.body, (err, user) => {
    if (err) return next(err)
    res.json({ data: user })
  })
})

router.put('/:id', (req, res, next) => {
  User.findByIdAndUpdate(req.params.id, req.body,
  { runValidators: true }, (err, user) => {
    if (err || !user) return next(err)
    res.json({ data: user })
  })
})

module.exports = router
