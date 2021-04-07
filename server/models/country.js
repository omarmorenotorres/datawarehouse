const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Region = mongoose.model('Region');

const CountrySchema = Schema({
    name: String,
    region: {
        type: Schema.ObjectId,
        ref: "Region"
    },
    description: String
});

module.exports = mongoose.model('Country', CountrySchema);