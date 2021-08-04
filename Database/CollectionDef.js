const mongoose = require('mongoose')

const collectionDefSchema = new mongoose.Schema({
  modelName: {
    type: String,
  },
  attributes: {
    type: Array,
  },
  collectionName: {
    type: String,
  },
})

module.exports = mongoose.model('Collections', collectionDefSchema)
