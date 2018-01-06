const User = require('../models/user')
const _ = require('lodash')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

module.exports.store = (req, res) => {
  let body = _.pick(req.body,['email', 'password', 'name'])
  var user
  User.findOne({
      email:body.email
  }).then((userData) => {
      user = userData;
      return bcrypt.compare(body.password,userData.password)
  }).then((pass) => {
      res.status(200).send({name:user.name, token:user.tokens[0].token})
  }).catch((e) => {
      res.status(400).send({message:'Usuario y/o password incorrecto'})
  })
}

module.exports.getToken = (req, res) => {
	let body = _.pick(req.body,['email','name','password'])
	User.findByCredentials(body.email, body.password)
	.then((user) => {
		return user.generateAuthToken().then((token) => {
            //res.status(200).send(user)
            res.header('x-auth', token).status(200).send(user)
		})
	}).catch((e) => {
		res.status(400).send({message:'Usuario y/o password incorrecto'})
	})	
}

module.exports.deleteToken = (req,res) => {
	let token = req.token
	let user = req.user
	console.log(user)
	User.findByToken(token).then((userData) => {
		//return user.delete().then()
		//console.log(userData)
	})
}

module.exports.delToken = (req,res) => {
	req.user.removeToken(req.token).then(() => {
		res.status(200).send()
	}, () => {
		res.status(400).send()
	})
}