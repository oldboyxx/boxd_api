function prepare(req, res, next) {

  // Remove certain props

  delete req.body._id
  delete req.body.created_at
  delete req.body.updated_at

  // Copy ID from req params to body

  let match = req.originalUrl.match(/\/([^\/]+)\/([^\/]+)/)
  if (match && match[2])
    req.body[match[1].slice(0, -1) + "_id"] = match[2]

  // Initialize data storage object

  req.$ = {}

  next()
}

module.exports = { prepare }