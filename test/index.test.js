const expect = require('expect')
const request = require('supertest')

const {app} = require('../index')
const client = require('../models/clientes')
const {ObjectID} = require('mongodb')
const {clients, populateClients, users} = require('./seed/seed')

beforeEach(populateClients)

describe('Post /cli', () => {
  it('should created a new client',(done) => {
    
    var clt = {
      name:"test",
      email: "test@example.com"
    }
   // var name = 'Cristian'
    request(app)
      .post('/cli')
      .set('x-auth', users[0].tokens[0].token)
      .send(clt)
      .expect(200)
      .expect((res) => {
        expect(res.body.client.name).toBe(clt.name)
      })
      .end((err , res)=>{
      if(err){
        return done(err)
      }
      
      client.find({name:clt.name}).then((data) => {
        expect(data.length).toBe(1)
        expect(data[0].name).toBe(clt.name)
        done();
      }).catch((e)=>done(e))
    })
  })

  it ('should not create it with invalid body data',(done)=>{
    var clt='';
    request(app)
    .post('/cli')
    .set('x-auth', users[0].tokens[0].token)
    .send({clt})
    .expect(400)
    .end((err , res)=>{
    if(err){
      return done(err)
    }
    
    client.find().then((data) => {
      expect(data.length).toBe(2)
      //expect(data[0].name).toBe(client.name)
      done();
    }).catch((e)=>done(e))
  })
  })
})

describe('GET /cli', ()=>{
  it('Should get all clients', (done)=>{
    request(app)
    .get('/cli')
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect((res) => {
      expect(res.body.data.length).toBe(2);
    })
    .end(done);
  })

  it('should return 400 if client not found', (done) => {
    let hexId = new ObjectID().toHexString();
    request(app)
      .get(`/cli/${hexId}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(400)
      .end(done)
  })

  it('shlud return 404 for non_object ids', (done) => {
    request(app)
      .get('/cli/123abd')
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  })
})

describe('Delete /cli', ()=>{
  it('Should remove a client', (done)=>{
    let hexId = clients[1]._id.toHexString();

    request(app)
      .delete(`/cli/${hexId}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.client._id).toBe(hexId)
      })
      .end((err, res) => {
        if(err) return done(err)
      })

      client.findById(hexId).then((data) => {
        expect(data).toNotExist();
        done();
      }).catch((e)=>done(e))
  })

  it('Should return 400 if client do not exist', (done) => {
    let hexid = new ObjectID().toHexString();
    request(app)
      .delete(`/cli/${hexid}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(400)
      .end(done)
  })

  it('Should return 404 if objectID is invalid', (done) => {
    request(app)
    .delete('/cli/123abd')
    .set('x-auth', users[0].tokens[0].token)
    .expect(404)
    .end(done);
  })
})

describe('PATCH /cli/id', ()=> {
  it('Should update a client', (done) => {
    let hexId = clients[0]._id.toHexString()
    let name = 'Francisco'

    request(app)
      .patch(`/cli/${hexId}`)
      .set('x-auth', users[0].tokens[0].token)
      .send({name})
      .expect(200)
      .expect((res) => {
        expect(res.body.client.name).toBe(name)
        expect(res.body.client.updateAt).toBeA('number')
      })
      .end(done)
  })
})