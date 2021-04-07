const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//const City = mongoose.model('User');

const UserSchema = Schema({
    username: String,
    email: String,
    password: String,
    name: String,
    lastName: String,
    phone: String,
    admin: Number,
    chanel: {
        type: Schema.ObjectId,
        ref: "Chanel"
    }
});

module.exports = mongoose.model('User', UserSchema);