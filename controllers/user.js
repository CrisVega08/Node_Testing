const User = require('../models/user')
const _ = require('lodash')
module.exports.store = (req, res) => {
  let body = _.pick(req.body,['email', 'password', 'name'])
  let user = new User(body)

  console.log(user)
  user.save().then((data) => {
    return user.generateAuthToken();
    //res.status(200).send({message:'user save!', data:data})
  })
  .then((token) => {
    res.header('x-auth', token).status(200).send(user)
  })
  .catch((err) => res.status(400).send(err))
}