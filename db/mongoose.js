const mongoose = require('mongoose')

mongoose.Promise = global.Promise;
module.exports.connectDB = mongoose.connect('mongodb://localhost/Camarelo', { useMongoClient: true })

