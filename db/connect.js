const mongoose = require('mongoose');

const connectDB = (url) => {
  mongoose.connect(url);
  return console.log('---- Connected to DB');
};

module.exports = connectDB;
