const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    place: { type: mongoose.Schema.Types.ObjectId, ref: 'Place', required: true },
    user:{type: mongoose.Schema.Types.ObjectId,required:true},
});
const Cart = mongoose.model('Cart', CartSchema);
module.exports = Cart;
