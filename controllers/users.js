const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');

router.get('/new', (req, res, next) => {
  res.render('register.ejs')
})

router.post('/', async (req, res, next) => {
  console.log('this route is being hit')
  const password = req.body.password;
  const passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  const newUser = {
    username: req.body.username,
    password: passwordHash
  };
  try {
    const createdUser = await User.create(newUser)
    if (createdUser) {
      console.log('created a user')
      // console.log(createdUser)
      req.session.logged = true;
      req.session.username = createdUser.username;
      req.session.userId = createdUser._id
      console.log(req.session)
      res.render('login.ejs')
    } else {
      req.session.message = "Sorry, your username or password is incorrect. Please try again"
    }
  } catch (err) {
    next(err)
  }
})

// get user by id (SHOW PAGE TO DISPLAY ALL OF THE USER'S PHOTOS)
router.get('/:id', async (req, res, next) => {
  const message = req.session.message;
  req.session.message = null;

  try {
    const foundUser = await Users.findById(req.params.id)
    console.log(foundUser);
    res.render('home.ejs', {
      session: JSON.stringify(req.session),
      access_token: req.session.access_token,
      refresh_token: req.session.refresh_token,
      // user: foundUser,
      message: message
    })
  } catch(err) {
    next(err)
  }
})

module.exports = router;
