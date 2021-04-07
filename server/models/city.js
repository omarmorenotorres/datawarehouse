const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Region = mongoose.model('Country');

const CitySchema = Schema({
    name: String,
    country: {
        type: Schema.ObjectId,
        ref: "Country"
    },
    description: String
});

module.exports = mongoose.model('City', CitySchema);