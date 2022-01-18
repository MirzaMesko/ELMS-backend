const moongose = require('mongoose');

const connectDB = async () => {
    try {
        await moongose.connect('mongodb+srv://elms:elms@cluster0.s7pcv.mongodb.net/Elms?retryWrites=true&w=majority', {
            useUnifiedTopology: true,
            useNewUrlParser: true
        })
    } catch (err) {
        console.error(err)
    }
};

module.exports = connectDB;