const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const GalleryScehma = new Schema({
    title: {
        required: true,
        type: String
    },
    description: {
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

const Gallery = mongoose.model('Gallery', GalleryScehma);
module.exports = Gallery;