const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: String,
  address: String,
  addedPhotos: [String],
  description: String,
  perks: [String],
  extraInfo: String,
  checkin: String,
  checkout: String,
  maxguest: Number,
  price: Number,
  comments: [{ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // Reference to User model
    text: String 
  }],  
  likes: { type: Number, default: 0 },  
  dislikes: { type: Number, default: 0 }  
});

const Place = mongoose.model('Place', placeSchema);

module.exports = Place;
