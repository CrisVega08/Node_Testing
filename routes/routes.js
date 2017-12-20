var express = require('express');
var clienteController = require('../controllers/clientes')

var route = express.Router();

route.get('/cli/:id',clienteController.get);
route.get('/cli', clienteController.getAll);
route.post('/cli',clienteController.store);
route.get('/rem',clienteController.remove)
module.exports = route