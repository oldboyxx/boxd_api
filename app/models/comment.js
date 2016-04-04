let actions = {

  createComment(req, res, next) {
    req.$.comment = req.$.task.comments.create({
      content: req.body.content,
      user: req.user.id
    })

    req.$.task.comments.push(req.$.comment)
    req.$.task.comments_count = req.$.task.comments.length
    next()
  },

  updateComment(req, res, next) {
    req.$.comment = req.$.task.comments.id(req.params.id)
    if (!req.$.comment) return next(_.$err('comment:null'))
    delete req.body.user // Protection
    req.$.comment.set(req.body)
    next()
  },

  deleteComment(req, res, next) {
    req.$.comment = req.$.task.comments.pull(req.params.id)
    req.$.task.comments_count = req.$.task.comments.length
    next()
  }
}

module.exports = actions
