const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    place: { type: mongoose.Schema.Types.ObjectId, ref: 'Place', required: true },
    user:{type: mongoose.Schema.Types.ObjectId,required:true},
    checkin: { type: Date, required: true },
    checkout: { type: Date, required: true },
    maxguest: { type: Number, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    price: { type: Number, required: true },
});
const Bookings = mongoose.model('Bookings', bookingSchema);
module.exports = Bookings;
