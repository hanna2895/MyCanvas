const express = require('express');
const router = express.Router();
const Photos = require('../models/photo');
const User = require('../models/user');

// add a new photo route
router.get('/new', (req, res, next) => {
  res.render('photos/new.ejs')
})

router.post('/', async (req, res, next) => {
  try {
    const foundUser = await User.findOne({username: req.session.username});
    console.log(foundUser)
    console.log(req.body, 'this is req.body from the add photo route')
    const newPhoto = await Photos.create(req.body);

    if (req.session.logged === true) {
      foundUser.photos.push(newPhoto);
      foundUser.save();
      // newPhoto.save();
      const foundUserId = foundUser._id;
      res.redirect('/users/' + foundUserId)

    } else {
      req.session.message = "You must be logged in to add a photo. Please log in or create a new account"
      res.redirect('/users/new')
    }

  } catch (err) {
    next(err)
  }
})

// a photo show page
router.get('/:id', async(req,res, next) => {
  console.log(req.body.id)
  const foundUser = await User.findOne({username: req.session.username})
  const foundPhoto = await Photos.findOne({_id: req.params.id})
  console.log(foundPhoto)
  res.render('photos/show.ejs', {
    photoShow: true,
    userShow: false,
    id: req.body.id,
    user: foundUser,
    photo: foundPhoto.url,
    access_token: req.session.access_token,
    refresh_token: req.session.refresh_token,
  })
})

// edit photo route
router.get('/edit', async(req, res, next) => {
  try {
    const user = await Users.findOne({username: req.session.username});

    if (user) {
      if (user.photos) {
        res.render('photos/edit.ejs', {
          user: user
        })
      } else {
        req.session.message = "You do not have any photos. Please add content to your page before trying to edit."
        res.redirect('/users/' + user._id)
      }
    } else {
      req.session.message = "You must be logged in to add or edit content."
      res.redirect('/')
    }
  } catch(err) {
    next(err)
  }
})

module.exports = router;
