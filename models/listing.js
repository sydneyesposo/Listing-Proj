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
        type: String,
        required: true
    },
    reviews: {
        type: Date,
    }
   
})

const UserSchema = new mongoose.Schema({
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  });
  
  module.exports = new mongoose.model("User", UserSchema);
  module.exports = new mongoose.model("Listing", listingSchema)
