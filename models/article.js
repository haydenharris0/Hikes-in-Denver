const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    length: {
        type: Number,
        required: true
    },
    difficulty: {
        type: String,
        required: true
    },
    distanceFromDowntown: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    review: {
        type: [String]
    },

});

module.exports = mongoose.model('Article', articleSchema);