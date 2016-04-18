require('../app/utils/lodash')

global.config = require('../config')

global.app = require('../app/app').start()
global.request = require('supertest')(app)

global.sinon = require('sinon')
global.chai = require('chai')
global.expect = global.chai.expect

global.util = require('./util')
