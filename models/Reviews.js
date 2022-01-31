const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const ReviewScehma = new Schema({
    title: {
        required: true,
        type: String
    },
    message: {
        required: true,
        type: String
    },
    datePosted:{
        type: Date,
        default: new Date()
    }
})

const Reviews = mongoose.model('Reviews', ReviewScehma);
module.exports = Reviews;