const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    reviews: {
        type: String,
    }
  })
const Review = mongoose.model('Review', ReviewSchema);

module.exports = Review;
