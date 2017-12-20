const Cliente = require('../models/clientes')

module.exports.store = (req, res) => {
  console.log("que locura")
  let cliente = new Cliente
  cliente.name = req.body.name;
  cliente.email = req.body.email;
  
  cliente.save().then((data) => {
    res.status(200).send({message:'Cliente Almacenado', data:data})
  })
  .catch((err) => res.status(400).send('No se puedo almacenar el cliente'))
}

module.exports.get = (req, res) => {
  let _id = req.params.id;
  Cliente.findById(_id,{})
  .then((data) => {
    res.status(200).send({message:'Cliente encontrado', data:data})
  })
  .catch((err) => res.status(400).send('No se puedo almacenar el cliente'))
}

module.exports.getAll = (req, res) => {
  Cliente.find({})
  .then(data => {
    let user = JSON.stringify(data,undefined,2)
    res.status(200).send({data});
  })
  .catch(e => res.status(400).send(e))
}

module.exports.remove = (req, res) => {
  Cliente.remove({}).then(()=>{
    console.log('everything is deleted')
  })
}