const mongoose = require('mongoose')

const connectDB = () => {
  mongoose.connect(
    'mongodb://localhost:27017/testDB',
    { useUnifiedTopology: true, useNewUrlParser: true },
    async (err) => {
      if (err) {
        console.log('Failed to connect to DB!')
      } else {
        console.log('Connected to DB successfully!')
      }
    }
  )
}

module.exports = { connectDB }
