let { createJWToken } = require('../app/middleware/authentication')

let util = {

  token(user) {
    return { 'x-jwtoken': createJWToken(user) }
  },

  getObjAndUser(type, admin=true, removeObj=false) {
    let s = seeds[type+'s']
    let obj = _.find(s, { archieved: false })

    if (removeObj) s.splice(_.indexOf(s, _.find(s, { _id: obj._id })), 1)

    let adminID = _.find(obj.users, { admin: admin })._id
    let seedUser = _.find(seeds.users, { _id: _.$toObjId(adminID) })

    return { ['seed'+_.upperFirst(type)]: obj, seedUser }
  }
}

module.exports = util
