const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    roles: {
        Member: {
            type: String,
            default: 'Member'
        },
        Librarian: String,
        Admin: String
    },
    email: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    name: String,
    bio:  String,
    image: String,
    owedBooks: Array,
    readingHistory: Array,
    notifications: Array,
    refreshToken: String
});

module.exports = mongoose.model('User', userSchema);