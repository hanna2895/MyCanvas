const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Photos = require('../models/photo');
const bcrypt = require('bcrypt');

router.get('/new', (req, res, next) => {
  const message = req.session.message;
  req.session.message = null;
  res.render('app-login.ejs', {
    message: message
  })
})

router.get('/register', (req, res, next) => {
  res.render('register.ejs')
})

// this is the registration route
router.post('/register', async (req, res, next) => {
  const password = req.body.password;
  const passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  const newUser = {
    username: req.body.username,
    password: passwordHash
  };
  try {
    const createdUser = await User.create(newUser)
    if (createdUser) {
      // console.log(createdUser)
      req.session.logged = true;
      req.session.username = createdUser.username;
      req.session.userId = createdUser._id
      res.render('login.ejs')
    } else {
      req.session.message = "Sorry, your username or password is incorrect. Please try again"
    }
  } catch (err) {
    next(err)
  }
})

router.post('/login', async (req, res, next) => {
  try {
    const user = await User.findOne({username: req.body.username})
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        req.session.logged = true;
        req.session.username = user.username;
        res.render('login.ejs')
      }
    } else {
      req.session.message = "Username or password is incorrect."
      res.redirect('/register.ejs')
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
    const foundUser = await User.findById(req.params.id)
    const photos = [];
    for (let i = 0; i < foundUser.photos.length; i++) {
      const foundPhoto = await Photos.findById(foundUser.photos[i]._id)
      photos.push(foundPhoto)
    }
    res.render('home.ejs', {
      userShow: true,
      photoShow: false,
      session: JSON.stringify(req.session),
      access_token: req.session.access_token,
      refresh_token: req.session.refresh_token,
      user: foundUser,
      photos: foundUser.photos,
      message: message
    })
  } catch(err) {
    next(err)
  }
})

// get all the users (index, community canvas list page)
router.get('/', async (req, res, next) => {
  try {
    const foundUsers = await User.find();
    res.render('users/index.ejs', {
      users: foundUsers
    })
  } catch(err) {
    next(err)
  }
})

module.exports = router;
