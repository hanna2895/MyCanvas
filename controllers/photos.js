const express = require('express');
const router = express.Router();
const Photos = require('../models/photo');
const User = require('../models/user');

router.get('/new', (req, res, next) => {
  res.render('photos/new.ejs')
})

router.post('/', async (req, res, next) => {
  try {
    const foundUser = await User.findOne({username: req.session.username});
    console.log(foundUser)
    const newPhoto = await Photos.create(req.body);

    if (req.session.logged === true) {
      foundUser.photos.push(newPhoto);
      foundUser.save();
      // const foundUserId = foundUser._id;
      res.redirect('/home')

    } else {
      req.session.message = "You must be logged in to add a photo. Please log in or create a new account"
      res.redirect('/users/new')
    }

  } catch (err) {
    next(err)
  }
})

module.exports = router;
