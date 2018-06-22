const express = require('express');
const router = express.Router();
const queryString = require('querystring');
const User = require('../models/user')


router.get('/', (req, res) => {
	res.render('app-login.ejs')
})

router.get('/home', async (req, res, next) => {
	const message = req.session.message;
	req.session.message = null;
	req.session.logged = true;

	try {
		console.log(req.session)
		console.log(req.session.username, 'this is req.session.username')
		const user = await User.findOne({username: req.session.username})
		console.log(user, 'this is user from the /home route')
		console.log(user._id, 'this is user id from the /home route')
		const userId = user._id
		res.redirect('/users/' + userId)
	} catch (err) {
		next(err)
	}

})

module.exports = router;
