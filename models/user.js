const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator')

var userSchema = new Schema({
  name:  { type: String, required: true },
  password: { type: String, trim: true, minlength: 6, required : true},
  email: { type: String, 
    trim: true, 
    minlength: 4, 
    required : true, 
    unique : true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  tokens:[{
    access:{ 
      type: String, 
      require: true
    },
    token:{
      type: String, 
      require: true
    }
  }],
  date: { type: Date, default: Date.now },
  hidden: Boolean
});

module.exports = mongoose.model('User',userSchema) 