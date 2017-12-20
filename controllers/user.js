const User = require('../models/user')

module.exports.save = (req, res) => {
  let user = new User
  user.name = 'Cristian',
  user.email = 'cristian,vega08@gmail.com',
  user.password = '123567',
  hidden = false

  user.save().then((data) => {
    res.status(200).send({message:'user save!', data:data})
  })
  .catch((err) => res.status(400).send('Don save'))
}