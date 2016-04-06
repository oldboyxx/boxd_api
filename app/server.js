// Lodash is the only global var
GLOBAL._ = require('lodash')

let express = require('express')
let app = express()
let mongoose = require('mongoose')
var bodyParser = require('body-parser')
let config = require('../config')
let { requestConfig, authentication, errorHandling } = require('./middleware')

mongoose.connect(config.dbPath)

require('./helpers')
require('./models')

app.use(bodyParser.json({ type: '*/*' }))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(require('cors')())

app.use(requestConfig.prepare)
app.use(/^((?!^\/auth\/).)*$/, authentication.validateTokenAndSetUser)
app.use('/', require('./routes'))
app.use(errorHandling.routeNotFound)
app.use(errorHandling.handleErrors)

app.listen(config.port)
