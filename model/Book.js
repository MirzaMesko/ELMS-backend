const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    publisher: String,
    category: {
        type: String,
        default: 'All Books',
    },
    description:  String,
    image: String,
    available: {
        type: String,
        default: 'true',
    },
    owedBy: {
        userId: String,
        dueDate: String,
    },
    rating: [{
      userId: String,
      rating: Number,  
    }],
    reviews: [{
        userId: String,
        timestamp: String,
        review: String,
    }],
    reservedBy: Array,
    serNo: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Book', bookSchema);