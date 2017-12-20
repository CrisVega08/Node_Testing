const express = require('express')
const bodyParser = require('body-parser')

const app = express()
const api = require('./routes/routes')
const Cliente = require('./models/clientes')

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use((req, res, next) =>{
	res.header('Access-Control-Allow-Origin','*');
	res.header('Access-Control-Allow-Headers','X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method');
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
	res.header('Allow','GET, POST, OPTIONS, POST, DELETE');

	next();
});	

//app.use(api)
app.post('/cli', (req,res) => {
	console.log(req.body)
	var cliente = new Cliente({
		name: req.body.client.name,
		email: req.body.client.email
	})

	cliente.save().then((client)=>{
		res.status(200).send({client})
	}).catch(() => res.status(400).send('Bad'))
})
app.get('/cli', (req,res) => {
	Cliente.find({})
	.then(data => {
		let user = JSON.stringify(data,undefined,2)
		res.status(200).send({data});
	})
	.catch(e => res.status(400).send(e))
})

module.exports = app;
