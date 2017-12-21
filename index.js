const port = process.env.PORT || 3001
const mongoose = require('./db/mongoose').connectDB
const app = require('./app')

mongoose.then(() => {
  app.listen(port,() => {
    console.log(`el servidor esta funcionando en localhost:${port}`);
  })
})
.catch((e) => console.log("No se puede conectar"+e))

module.exports = {app};