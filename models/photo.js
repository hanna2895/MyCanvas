const mongoose = require('mongoose');

const photoSchema = mongoose.Schema({
  url: {
    type: String
  },
  title: {
    type: String
  },
  description: {
    type: String
  }
})

module.exports = mongoose.model('Photos', photoSchema)
