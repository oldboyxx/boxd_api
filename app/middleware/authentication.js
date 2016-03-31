function authenticateUser(req, res, next) {
  req.user = { id: "56fb30f801a911703cd3d9e2" }

  let modIDs = [
    "56fb30f801a911703cd3d9e2"
  ]

  req.user.isAdmin = _.includes(modIDs, req.user.id)

  next()
}

module.exports = { authenticateUser }