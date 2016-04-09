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
    if (req.user.id !== req.$.comment.user) return next(_.$err('denied'))

    delete req.body.user // Protection
    req.$.comment.set(req.body)
    next()
  },

  deleteComment(req, res, next) {
    let comments = req.$.task.comments
    req.$.comment = comments.id(req.params.id)

    if (!req.$.comment) return next(_.$err('comment:null'))
    if (req.user.id !== req.$.comment.user) return next(_.$err('denied'))

    comments.splice(_.indexOf(comments, req.$.comment), 1)
    req.$.task.comments_count = comments.length
    next()
  }
}

module.exports = actions
