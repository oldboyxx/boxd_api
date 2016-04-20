let app = require('express')()
var bodyParser = require('body-parser')
let config = require('../config')
let { requestConfig, authentication, errorHandling, development } = require('./middleware')

app.use(bodyParser.json({ type: '*/*' }))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(require('cors')())

app.use(requestConfig.prepare)
app.use(development.becomeDevUser)

app.use(/^((?!^\/auth\/).)*$/,
  authentication.validateTokenAndSetUser,
  authentication.returnCurrentUser
)

app.use('/', require('./routes'))
app.use(errorHandling.routeNotFound)
app.use(errorHandling.handleErrors)

module.exports = {
  start() {
    app.listen(config.port)
    return app
  }
}
