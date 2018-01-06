const expect = require('expect')
const request = require('supertest')

const {app} = require('../index')
const User = require('../models/user')
const {ObjectID} = require('mongodb')
const {users, populateUsers} = require('./seed/seed')

beforeEach(populateUsers)

describe('POST /usr/login', () => {
	it('Should login user and return token', (done) => {
		//console.log(users[0])
		request(app)
			.post('/usr/login')
			.send({
				email:users[1].email,
				password:users[1].password
			})
			.expect(200)
			.expect((res) => {
				expect(res.headers['x-auth']).toExist();
			})
			.end((err, res) => {
				if(err) return done(err)

				User.findById(users[1]._id).then((user) => {
					expect(user.tokens[0]).toInclude({
						access:'auth',
						token: res.headers['x-auth']
					})
					done()
				}).catch((e) => done(e))
			})
	})

	it('Should reject invalid login', (done) => {
		request(app)
			.post('/usr/login')
			.send({
				email:users[0].email,
				password:users[1].password
			})
			.expect(400)
			.expect((res) => {
				expect(res.headers['x-auth']).toNotExist()
			})
			.end((err, res) => {
				if(err) return done(err)

				User.findById(users[1]._id).then((user) => {
					expect(user.tokens.length).toBe(0)
					done()
				}).catch((e) => done(e))
			})
	})
})

describe('DELETE /usr/login', () => {
	it('Should remove auth token', (done) => {
		request(app)
			.delete('/usr/logout')
			.set('x-auth',users[0].tokens[0].token)
			.expect(200)
			.end((err, res) => {
				
				if(err) return done(err)

				User.findById(users[0]._id).then((user) => {
					expect(user.tokens.length).toBe(0)
					done()
				}).catch((e) => done(e))
			})
	})
})
