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
  const foundUser = await User.findOne({username: req.session.username})
  const foundPhoto = await Photos.findOne({_id: req.params.id})
  res.render('home.ejs', {
    photoShow: true,
    userShow: false,
    id: foundPhoto._id,
    user: foundUser,
    photo: foundPhoto.url,
    title: foundPhoto.title,
    description: foundPhoto.description,
    access_token: req.session.access_token,
    refresh_token: req.session.refresh_token,
  })
})

// edit photo route
router.get('/edit/:id' , async(req, res, next) => {
  try {
    const user = await User.findOne({username: req.session.username});
    const photo = await Photos.findById({_id: req.params.id})
    console.log(photo._id, 'this is photo id --------')
    if (user) {
      if (user.photos) {
        res.render('home.ejs', {
          user: user,
          photoId: photo._id,
          url: photo.url,
          title: photo.title,
          description: photo.description,
          userShow: false,
          photoShow: false,
          editPhoto: true,
          access_token: req.session.access_token,
          refresh_token: req.session.refresh_token
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

router.put('/:id', async(req, res, next) => {
  console.log('this put route is being hit')
  try {
    const updatedPhoto = await Photos.findByIdAndUpdate(req.params.id, req.body, {new: true});
    const foundUser = await User.findOne({username: req.session.username});

    foundUser.photos.id(req.params.id).remove();
    foundUser.photos.push(updatedPhoto);

    const foundUserId = foundUser._id;
    const savedFoundUser = await foundUser.save();
    res.redirect('/photos/' + updatedPhoto._id)
  } catch(err) {
    next(err);
  }
})

module.exports = router;
