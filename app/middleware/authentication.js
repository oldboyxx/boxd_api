function authenticateUser(req, res, next) {
  req.user = { id: "56f6eafd97fda0a1797e2080" }
  next()
}

module.exports = { authenticateUser }