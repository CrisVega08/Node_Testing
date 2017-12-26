const express = require('express')
const bodyParser = require('body-parser')
const {ObjectID} = require('mongodb')

const app = express()
const api = require('./routes/routes')
const Cliente = require('./models/clientes')

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use((req, res, next) =>{
	res.header('Access-Control-Allow-Origin','*');
	res.header('Access-Control-Allow-Headers','X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, Authorization');
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
	res.header('Allow','GET, POST, OPTIONS, PUT, DELETE');

	next();
});	

app.use(api)

module.exports = app;
