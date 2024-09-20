const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
});

// Ensuring unique index is created
UserSchema.index({ email: 1 }, { unique: true });

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;
