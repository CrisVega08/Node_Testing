const env = process.env.NODE_ENV || 'development'
console.log('env ******** ', env)
if(env === 'development'){
  process.env.PORT = 3001;
  process.env.MONGODB_URI = 'mongodb://localhost/Camarelo'
} else if(env === 'test'){
  process.env.PORT = 3001;
  process.env.MONGODB_URI = 'mongodb://localhost/CamareloTest'  
}
else if(env === 'production'){
  process.env.MONGODB_URI = 'mongodb://Cristian08:NodeAngular2017@ds161446.mlab.com:61446/caramelo' 
}