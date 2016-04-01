function configure(req, res, next) {

  // Copy ID from req params to body

  let match = req.originalUrl.match(/\/([^\/]+)\/([^\/]+)/)
  req.body[match[1].slice(0, -1) + "_id"] = match[2]

  // Initialize req storage object

  req.$ = {}

  next()
}

module.exports = { configure }