const mongoose = require('mongoose');
const Photos = require('./photo');

const userSchema = mongoose.Schema({
  username: {
    type: String
  },
  password: {
    type: String
  },
  photos: [Photos.schema]
})

module.exports = mongoose.model("User", userSchema);
