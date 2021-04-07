const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChanelSchema = Schema({
    chanel: String,
    userAccount: String,
    preference: String
});

module.exports = mongoose.model('Chanel', ChanelSchema);