const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const BlogPostScehma = new Schema({
    title: {
        required: true,
        type: String
    },
    message: {
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

const BlogPost = mongoose.model('BlogPost', BlogPostScehma);
module.exports = BlogPost;