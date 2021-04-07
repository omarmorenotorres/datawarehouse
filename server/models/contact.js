const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ContactSchema = Schema({
    name: String,
    job: String,
    mail: String,
    company: String,
    region: String,
    country: String,
    city: String,
    address: String,
    value: String,
    chanel: {
        type: new Array()
    }
});

module.exports = mongoose.model('Contact', ContactSchema);