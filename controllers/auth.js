const express = require('express');
const router = express.Router();
const queryString = require('querystring')


router.get('/', (req, res) => {
	res.render('login.ejs')
})

// var access_token = req.query.access_token,
//             refresh_token = body.refresh_token;

// router.get('/#' + queryString.stringify({ access_token: req.query.access_token, refresh_token: req.query.refresh_token }), (req, res) => {

// 	res.render('home.ejs')
// });

router.get('/home', (req, res) => {
	console.log(req.session, "THIS IS REQ.SESSION");
	res.render('home.ejs', {
		session: JSON.stringify(req.session),
		access_token: req.session.access_token,
		refresh_token: req.session.refresh_token
	})

	console.log(req.session);
})

module.exports = router;
