describe('CREATE /lists', () => {
  it('should create list', (done) => {

    let { seedBoard, seedUser } = util.getObjAndUser('board')

    let listData = {
      title: 'List title',
      position: 1,
      board_id: seedBoard.id
    }

    request.post('/lists')
      .set(util.token(seedUser))
      .send(listData)
      .expect(200)
      .expect(res => {
        let list = res.body.data.list
        expect(list.title).to.contain('List title')
        expect(list.board_id).to.equal(seedBoard.id)
        expect(list.archieved).to.be.false
      }).end(done)
  })
})

describe('PUT /lists/:id', () => {
  it('should update list', (done) => {

    let { seedBoard, seedUser } = util.getObjAndUser('board', false)
    let seedList = _.find(seeds.lists, { board_id: seedBoard._id })

    let updateData = {
      position: 10
    }

    request.put('/lists/'+seedList.id)
      .set(util.token(seedUser))
      .send(updateData)
      .expect(200)
      .expect(res => {
        expect(res.body.data.list.position).to.equal(10)
      }).end(done)
  })
})
