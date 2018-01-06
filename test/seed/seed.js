const {ObjectID} = require('mongodb')
const jwt = require('jsonwebtoken')

const client = require('../../models/clientes')
const User = require('../../models/user')

const userOneId = new ObjectID()
const userTwoId = new ObjectID()

const users = [{
		_id: userOneId,
		email: 'cv@mail.com',
		name: 'CV',
		password: 'cv123',
		tokens: [{
			access:'auth',
			token: jwt.sign({_id:userOneId,access:'auth'}, 'abc123').toString()
		}]
	},{
		_id: userTwoId,
		email: 'cris@mail.com',
		name: 'Cris',
		password: 'cris123'
	}]

const clients = [
	{ 
		_id: new ObjectID(),
		name:"Cristian",
		email:"cristian@email.com",
		_creator: userOneId
	},
	{
		_id: new ObjectID(),
		name:"Vega",
		email:"email@example.com",
		_creator: userTwoId
	}
]

const populateClients = (done)=>{
  client.remove({}).then(()=> {
    return client.insertMany(clients);
  }).then(() => done());
}

const populateUsers = (done) => {
	User.remove({}).then(()=> {
		var userOne = new User(users[0]).save()
		var userTwo = new User(users[1]).save()

		return Promise.all([userOne, userTwo])
	}).then(() => done())
}

module.exports= { clients, 
		populateClients,
		users,
		populateUsers
 	}