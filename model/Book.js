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
    serNo: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Book', bookSchema);