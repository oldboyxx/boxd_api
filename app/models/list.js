
let actions = {

  createList(req, res, next) {
    req.$.list = req.$.board.lists.create({
      title: req.body.title,
      position: req.body.position
    })

    req.$.board.lists.push(req.$.list)
    next()
  },

  updateList(req, res, next) {
    req.$.list = req.$.board.lists.id(req.params.id)
    if (!req.$.list) return next()
    req.$.list.set(req.body)
    next()
  }
}


module.exports = actions

