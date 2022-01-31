const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const CatalogScehma = new Schema({
    title: {
        required: true,
        type: String
    },
    description: {
        required: true,
        type: String
    },
    price:{
        required: true,
        type: String
    },
    image: {
        required: true,
        type: String
    },
    email: {
        required: true,
        type: String
    },
    datePosted:{
        type: Date,
        default: new Date()
    }
})

const Catalog = mongoose.model('Catalog', CatalogScehma);
module.exports = Catalog;