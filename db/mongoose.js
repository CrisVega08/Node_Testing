const mongoose = require('mongoose')

mongoose.Promise = global.Promise;
module.exports.connectDB = mongoose.connect('mongodb://Cristian08:NodeAngular2017@ds161446.mlab.com:61446/caramelo'||'mongodb://localhost/Camarelo', { useMongoClient: true })

