const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
    category: {
        type: String,
        enum: ['Residential', 'Agricultural', 'Commercial']
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    description: {
        type: String,
    },
    address: {
        type: String,
        required: true
    },
    date: {
        type:  Date,
    },
    reviews: {
        type: String,
    }
   
   
})



  const Listing = mongoose.model('Listing', listingSchema);
  module.exports = Listing;

