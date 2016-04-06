process.env.NODE_ENV = 'development'

global._ = require('lodash')
global.config = require('../config')
global.request = require('supertest')(config.appURL)
global.sinon = require('sinon')
global.chai = require('chai')
global.expect = global.chai.expect
