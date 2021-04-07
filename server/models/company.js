const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const City = mongoose.model('City');

const CompanySchema = Schema({
    name: String,
    address: String,
    country: {
        type: Schema.ObjectId,
        ref: "Country"
    }    
});

module.exports = mongoose.model('Company', CompanySchema);