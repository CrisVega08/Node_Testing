User = require('../models/user')

module.exports = authenticate = (req, res, next) =>{   // var authenticate = (req, res) => {}
	var token = req.header('x-auth');
//	console.log(token)
	User.findByToken(token).then((user) => {
		if(!user) return Promise.reject()
		
		req.user = user
		req.token = token

		next();
	}).catch((e) => {
		
		res.status(401).send()
	})
}
