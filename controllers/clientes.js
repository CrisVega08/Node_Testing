const Cliente = require('../models/clientes')
const {ObjectID} = require('mongodb')
const _ = require('lodash')

module.exports.store = (req, res) => {
  let cliente = new Cliente
  cliente.name = req.body.name;
  cliente.email = req.body.email;
  
  cliente.save().then((data) => {
    res.status(200).send({message:'Cliente Almacenado', client:data})
  })
  .catch((err) => res.status(400).send('No se puedo almacenar el cliente'))
}

module.exports.get = (req, res) => {
  let id = req.params.id;
	if(!ObjectID.isValid(id)){
		return res.status(404).send();
	}
  Cliente.findById(id,{})
  .then((data) => {
    if(!data) return res.status(400).send({message:'Cliente no encontrado', data:data})
    res.status(200).send({message:'Cliente encontrado', data:data})
  })
  .catch((err) => res.status(400).send(err))
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

module.exports.delete = (req,res) => {
  let id = req.params.id;
	if(!ObjectID.isValid(id)){
		return res.status(404).send();
	}
  Cliente.findByIdAndRemove(id)
  .then((data) => { 
    if(!data) return res.status(400).send({message:`Registro no encontrado`,client:data})
    res.status(200).send({message:`Registro eliminado`,client:data})
  })
}

module.exports.deleteTwo = (req,res) => {
  let id = req.params.id
  Cliente.findByIdAndRemove({_id:id})
  .then((data) => res.status(200).send({message:`Registro eliminado`,client:data}))
}

module.exports.update =(req,res) => {
  let id = req.params.id
  let body = _.pick(req.body,['name','email']);
  
  if(!ObjectID.isValid(id)){
		return res.status(404).send();
  }
  
  body.updateAt = new Date().getTime();

  Cliente.findByIdAndUpdate(id,{$set:body},{ new:true })
  .then((data) => {
    if(!data) return res.status(400).send()
    res.status(200).send({message:'Cliente actualizado',client:data})
  }).catch((e)=> res.status(404).send(e))
}