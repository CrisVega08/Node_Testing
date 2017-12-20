var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  name:  { type: String, required: true },
  password: { type: String, trim: true, minlength: 4, required : true },
  email:   String,
  date: { type: Date, default: Date.now },
  hidden: Boolean
});

module.exports = mongoose.model('User',userSchema) 