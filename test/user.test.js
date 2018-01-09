const expect = require('expect')
const request = require('supertest')

const {app} = require('../index')
const User = require('../models/user')
const {ObjectID} = require('mongodb')
const {users, populateUsers} = require('./seed/seed')

beforeEach(populateUsers)

describe(' Get /usr/me', () => {
	it('Should return user if authentcated', (done) => {
		request(app)
			.get('/usr/me')
			.set('x-auth',users[0].tokens[0].token)
			.expect(200)
			.expect((res) => {
				expect(res.body._id).toBe(users[0]._id.toHexString())
				expect(res.body.email).toBe(users[0].email)
			})
			.end(done)
	});

	it('Should return 401 if not authenticated', (done) => {
		request(app)
			.get('/usr/me')
			.expect(401)
			.expect((res) => {
				expect(res.body).toEqual({})
			})
			.end(done)
	})
})

describe('POST /usr', () => {
	it('Should create a user', (done) => {
		var userTest = {
			name:"CV",
			password:"abc123",
			email:"correo@mail.com"
		}

		request(app)
			.post('/usr')
			.send(userTest)
			.expect(200)
			.expect((res) => {
				expect(res.headers['x-auth']).toBeTruthy()
				expect(res.body._id).toBeTruthy()
				expect(res.body.password).toBeFalsy()
			})
			.end((err) => {
				if(err) done(err)

				User.findOne({email:userTest.email}).then((user) => {
					//console.log(user)
					expect(user).toBeTruthy()
					expect(user.password).not.toBe(userTest.password)
					done()
				}).catch((e) => done(e))
			})
	})
	
	it('Should return a validation errors if request invalid', (done) => {
		var userTest = {
			name:"CV",
			password:"abc",
			email:"correo"
		}

		request(app)
			.post('/usr')
			.send(userTest)
			.expect(400)
			.end(done)
	})

	it('Should not create user if email is use' , (done) => {
		var userTest = {
			name:"CV",
			password:"abc123",
			email:users[0].email
		}

		request(app)
			.post('/usr')
			.send(userTest)
			.expect(400)
			.end(done)
	})
})
