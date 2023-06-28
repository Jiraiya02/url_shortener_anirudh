const mongoose = require('mongoose')
const shortId = require('shortid')


const shortUrlSchema = new mongoose.Schema({
  fullurl: {
    type: String,
    required: true
  },
  note: {
    type: String,
    required: true
  },
  shorturl: {
    type: String,
    required: true,
    default: shortId.generate
  },
  clicks: {
    type: Number,
    required: true,
    default: 0
  }
})

module.exports = mongoose.model('Text', shortUrlSchema)