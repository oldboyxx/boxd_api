function authenticateUser(req, res, next) {
  req.user = { id: "56ffc25e8a654b0d3126bdaf" }

  let modIDs = [
    "56ffc25e8a654b0d3126bdaf"
  ]

  req.user.isAdmin = _.includes(modIDs, req.user.id)

  next()
}

module.exports = { authenticateUser }