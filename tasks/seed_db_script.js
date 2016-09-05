let mongoose = require('mongoose')
let f = require('faker')
let config = require('../config')
let models = require('../app/models/models')

/**
* Drop database helper
*/

function dropDatabase() {
  mongoose.connection.db.dropDatabase()
}

/**
* Build objects
*/

let defaultSeedSize = {
  users: 10,
  projects: 3,
  boards: 4,
  lists: 5,
  tasks: 5
}

let devEmail = config.devEmail

function batchBuild(size={}) {
  size = _.assign(defaultSeedSize, size)
  let seeds = {}

  seeds.users = _.times(size.users, (i) => {
    return new models.User({
      name: f.name.findName(),
      email: i ? _.random(99999999)+f.internet.email() : devEmail,
      avatar: {
        provider: 'google',
        url: f.internet.avatar()
      }
    })
  })

  seeds.projects = _.times(size.projects, (i) => {

    let sample = _.sampleSize(seeds.users, 5)
    let devUser = _.find(seeds.users, { email: devEmail })
    sample.push(devUser)

    let users = _.map(_.uniq(sample), (user, j) => {
      return { _id: user._id, admin: !!j }
    })

    return new models.Project({
      title: f.company.companyName(),
      users,
      archieved: !i
    })
  })

  seeds.boards = _.flatMap(seeds.projects, (project) => {
    return _.times(size.boards, (i) => {

      let users = _.map(project.users, (user, j) => {
        return { _id: user._id, admin: !!j }
      })

      return new models.Board({
        title: f.commerce.department(),
        project_id: project._id,
        users,
        archieved: !i
      })
    })
  })

  seeds.lists = _.flatMap(seeds.boards, (board) => {
    return _.times(size.lists, (i) => {
      return new models.List({
        title: f.commerce.department(),
        position: i,
        board_id: board._id,
        archieved: !i
      })
    })
  })

  seeds.tasks = _.flatMap(seeds.lists, (list) => {
    return _.times(size.tasks, (i) => {

      let board = _.find(seeds.boards, { _id: list.board_id })
      let users = _.map(_.sampleSize(board.users, _.random(0,2)), '_id')
      let labels = _.map(_.sampleSize(board.labels, 1), '_id')

      let comments = _.times(_.random(1,2), () => {
        return {
          content: f.company.catchPhrase(),
          user: _.sample(board.users)._id,
          created_at: new Date
        }
      })

      let comments_count = _.size(comments)

      return new models.Task({
        title: i%2 ? f.hacker.phrase() : f.commerce.productName(),
        position: i,
        board_id: list.board_id,
        list_id: list._id,
        users,
        labels,
        comments,
        comments_count,
        archieved: !i
      })
    })
  })

  return seeds
}

/**
* Insert objects into database
*/

let modelNames = _.map(_.keys(models), _.lowerFirst)
let objectCount = _.fromPairs(_.map(modelNames, (n) => { return [n+'s', 0] }))

function batchInsert({ size={}, times=1, log=false }={}, callback) {
  if (log) console.log(times+'-----------')
  if (log) console.time('done in')

  let seeds = batchBuild(size)

  _.each(modelNames, (name, i) => {
    models[_.upperFirst(name)].create(seeds[name+'s'], (err, items) => {
      if (err) return (callback || console.error)(err)

      objectCount[name+'s'] += items.length
      if (log) console.log(name + 's: ' + objectCount[name+'s'])

      if (i === modelNames.length-1) {
        if (log) console.timeEnd('done in')
        if (--times) {
          _.delay(batchInsert, 5, { size, times, log }, callback)
        } else {
          if (callback) callback(null, seeds, objectCount)
        }
      }
    })
  })
}

module.exports = {
  dropDatabase,
  batchBuild,
  batchInsert
}
