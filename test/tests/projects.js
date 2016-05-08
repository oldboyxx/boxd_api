describe('CREATE /projects', () => {
  it('should create project', (done) => {

    let seedUser = seeds.users[0]
    let projectData = {
      title: 'Project title',
      avatar: 'www.url.com/img'
    }

    request.post('/projects')
      .set(util.token(seedUser))
      .send(projectData)
      .expect(200)
      .expect(res => {
        let project = res.body.data.project
        expect(project.title).to.contain('Project title')
        expect(project.avatar).to.be.a('string')
        expect(project.users[0]._id).to.equal(seedUser.id)
        expect(project.users[0].admin).to.be.true
        expect(project.archieved).to.be.false
      }).end(done)
  })
})

describe('GET /projects', () => {
  it('should return projects and boards', (done) => {

    let { seedProject, seedUser } = util.getObjAndUser('project')

    request.get('/projects')
      .set(util.token(seedUser))
      .expect(200)
      .expect(res => {
        let data = res.body.data
        expect(data.projects).to.be.an('array').and.not.be.empty
        expect(data.boards).to.be.an('array').and.not.be.empty
        expect(data.projects[0].title).to.be.a('string')
        expect(data.boards[0].title).to.be.a('string')
      }).end(done)
  })
})

describe('GET /projects/:id', () => {
  it('should return single project with boards and users', (done) => {

    let { seedProject, seedUser } = util.getObjAndUser('project')

    request.get('/projects/'+seedProject.id)
      .set(util.token(seedUser))
      .expect(200)
      .expect(res => {
        let data = res.body.data
        expect(data.project._id).to.equal(seedProject.id)
        expect(data.boards).to.be.an('array').and.not.be.empty
        expect(data.users).to.be.an('array').and.not.be.empty
      }).end(done)
  })
})

describe('PUT /projects/:id', () => {
  it('should NOT update project when user is not admin', (done) => {

    let { seedProject, seedUser } = util.getObjAndUser('project', false)

    request.put('/projects/'+seedProject.id)
      .set(util.token(seedUser))
      .send({})
      .expect(403)
      .end(done)
  })

  it('should remove current user from project even if user is not admin', (done) => {

    let { seedProject, seedUser } = util.getObjAndUser('project', false, true)

    request.put('/projects/'+seedProject.id)
      .set(util.token(seedUser))
      .send({ remove_user: seedUser.id })
      .expect(200)
      .expect(res => {
        let user = _.find(res.body.data.project.users, { _id: seedUser.id })
        expect(user).to.not.exist
      })
      .end(done)
  })

  it('should update project when user is admin && if a user is removed from project, he should be removed from all boards aswell', (done) => {

    let { Board } = require('../../app/models/models')
    let { seedProject, seedUser } = util.getObjAndUser('project', true, true)

    let updateData = {
      title: 'updated',
      remove_user: seedUser.id
    }

    request.put('/projects/'+seedProject.id)
      .set(util.token(seedUser))
      .send(updateData)
      .expect(200)
      .expect(res => {
        expect(res.body.data.project.title).to.contain('updated')
        let user = _.find(res.body.data.project.users, { _id: seedUser.id })
        expect(user).to.not.exist

      }).end(() => {
        let sel = { project_id: seedProject.id, 'users._id': seedUser.id }

        Board.find(sel, (err, boards) => {
          if (err) done(err)
          expect(boards).to.be.empty
          done()
        })
      })
  })
})



























