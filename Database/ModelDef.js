const mongoose = require('mongoose')

const modelDefSchema = new mongoose.Schema({
  modelName: {
    type: String,
  },
  attributes: {
    type: Object,
  },
})

module.exports = mongoose.model('Models', modelDefSchema)
