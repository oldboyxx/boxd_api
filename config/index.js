let config = {

  base: {
    port: process.env.PORT || 3000
  },

  development: {
    appURL: 'http://localhost:3000',
    devEmail: 'dank@memer.com'
  },

  test: {
    appURL: 'http://localhost:3000',
    devEmail: 'dank@memer.com'
  },

  production: {
  }
}

let cf = _.merge(config.base, config[process.env.NODE_ENV], require('./secrets'))

module.exports = cf
