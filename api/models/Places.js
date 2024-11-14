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
  price:Number,
});

const Place = mongoose.model('Place', placeSchema);

module.exports = Place;
