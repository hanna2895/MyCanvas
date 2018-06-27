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
		const user = await User.findOne({username: req.session.username})
		const userId = user._id
		res.redirect('/users/' + userId)
	} catch (err) {
		next(err)
	}

})

router.get('/logout', (req, res) => {
	req.session.destroy((err) => {
		if (err) {
			console.log('the session could not be destroyed', err);
		} else {
			console.log('the session was successfully destroyed and you have been logged out.')
				res.render('app-login.ejs')
		}
	})
})

module.exports = router;
