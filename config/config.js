const env = process.env.NODE_ENV || 'development'

if(env === 'test' || env === 'development'){
  const config = require('./config.json')
  var envConfig = config[env]
  
  Object.keys(envConfig).forEach((key) => {
    process.env[key] = envConfig[key];
  })
}
// console.log('env ******** ', env)
// if(env === 'development'){
//   process.env.PORT = 3001;
//   process.env.MONGODB_URI = 'mongodb://localhost/Camarelo'
// } else if(env === 'test'){
//   process.env.PORT = 3001;
//   process.env.MONGODB_URI = 'mongodb://localhost/CamareloTest'  
// }
// else if(env === 'production'){
//   process.env.MONGODB_URI = 'mongodb://Cristian08:NodeAngular2017@ds161446.mlab.com:61446/caramelo' 
// } 

// heroku config:set MONGO_URI=ddjdkjdf
// heroku config:unset MONGO_URI