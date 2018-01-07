const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator')
const jwt = require('jsonwebtoken')
const _ = require('lodash')
const bcrypt = require('bcryptjs')

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
  var token = jwt.sign({_id: user._id.toHexString(), access},process.env.JWT_SECRET).toString();

  user.tokens.push({access, token})
  //console.log(user.tokens)
  return user.save().then(() => {
    return token
  })
}

userSchema.methods.removeToken = function (token) {
  var user = this;
  
  return user.update({
    $pull:{
      tokens:{token}
    }
  })
}

userSchema.statics.findByToken = function (token) {
  var User = this;
  var decoded;
  
  try{
    decoded = jwt.verify(token , process.env.JWT_SECRET)
  }
  catch (e){
    return Promise.reject()
  }

  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access':'auth'
  })
}

userSchema.statics.findByCredentials = function (email, password) {
  var User = this;

  return User.findOne({email}).then((user) => {
    if(!user){
      return Promise.reject();
    }
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        if(err) reject()
        if(res) resolve(user)
        else reject()
      })
    })
  })
}

userSchema.pre('save', function (next) {
  var user = this;
  //console.log(user)
  if(user.isModified('password')){
    
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt , (err, hash) => {
        user.password = hash
        next()
      })
    })
  }
  else {
    next()
  }
})

module.exports = mongoose.model('User', userSchema)