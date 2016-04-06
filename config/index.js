let config = {

  base: {
    port: process.env.PORT || 3000
  },

  development: {
    appURL: 'http://localhost:3000'
  },

  test: {
    appURL: 'http://localhost:3000'
  },

  production: {
  }
}

let cf = _.merge(config.base, config[process.env.NODE_ENV], require('./secrets'))

module.exports = cf
