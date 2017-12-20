const expect = require('expect')
const request = require('supertest')

const {app} = require('../index')
const cliente = require('../models/clientes')

const clientes = [
  {
    name:"Cristian",
    email:"cristian@email.com"
  },
  {
    name:"Vega",
    email:"email@example.com"
  }
]

beforeEach((done)=>{
  cliente.remove({}).then(()=> {
    return cliente.insertMany(clientes);
  }).then(() => done());
})
describe('Post /cli', () => {
  it('should created a new client',(done) => {
    
    var client = {
      name:"test",
      email: "test@example.com"
    }
   // var name = 'Cristian'
    request(app)
      .post('/cli')
      .send({client})
      .expect(200)
      .expect((res) => {
        expect(res.body.client).toContain(client)
      })
      .end((err , res)=>{
      if(err){
        return done(err)
      }
      
      cliente.find({name:client.name}).then((data) => {
        expect(data.length).toBe(1)
        expect(data[0].name).toBe(client.name)
        done();
      }).catch((e)=>done(e))
    })
  })

  it ('should not create it with invalid body data',(done)=>{
    var client='';
    request(app)
    .post('/cli')
    .send({client})
    .expect(400)
    .end((err , res)=>{
    if(err){
      return done(err)
    }
    
    cliente.find().then((data) => {
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
    .expect(200)
    .expect((res) => {
      expect(res.body.data.length).toBe(2);
    })
    .end(done);
  })
})