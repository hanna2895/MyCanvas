const express = require('express');
const router = express.Router();
const queryString = require('querystring');
const User = require('../models/user')


router.get('/', (req, res) => {
	res.render('register.ejs')
})

// var access_token = req.query.access_token,
//             refresh_token = body.refresh_token;

// router.get('/#' + queryString.stringify({ access_token: req.query.access_token, refresh_token: req.query.refresh_token }), (req, res) => {

// 	res.render('home.ejs')
// });

router.get('/home', async (req, res, next) => {
	const message = req.session.message;
	req.session.message = null;
	// res.render('home.ejs', {
	// 	session: JSON.stringify(req.session),
	// 	access_token: req.session.access_token,
	// 	refresh_token: req.session.refresh_token
	// })
	try {
		const foundUser = await User.findById(req.params.id)
		console.log(foundUser);
		res.render('home.ejs', {
			session: JSON.stringify(req.session),
			access_token: req.session.access_token,
			refresh_token: req.session.refresh_token,
			// user: foundUser,
			message: message
		})
	} catch (err) {
		next(err)
	}

})

module.exports = router;
