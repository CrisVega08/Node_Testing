const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator')
const jwt = require('jsonwebtoken')
const _ = require('lodash')

var userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    trim: true,
    minlength: 4,
    required: true
  },
  email: {
    type: String,
    trim: true,
    minlength: 6,
    required: true,
    unique: true,
    validate: {
      validator:  validator.isEmail,
      // validator: (value)=>{
      //   return validator.isEmail(value)
      // },
      message: '{VALUE} is not a valid email'
    }
  },
  tokens: [{
    access:{
      type: String,
      require: true
    },
    token:{
      type: String,
      require: true
    }
  }]
});

userSchema.methods.toJSON = function () {
  var user = this
  var userObject = user.toObject()

  return _.pick(userObject, ['_id', 'email','name'])
}

userSchema.methods.generateAuthToken = function () {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access},'abc123').toString();

  user.tokens.push({access, token})

  return user.save().then(() => {
    return token
  })
}

userSchema.statics.findByToken = function (token) {
  var user = this;
  var decoded;
  
  try{
    decoded = jwt.verify(token , 'abc123')
  }
  catch (e){
    return Promise.reject()
  }

  return user.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access':'auth'
  })
}

module.exports = mongoose.model('User', userSchema)