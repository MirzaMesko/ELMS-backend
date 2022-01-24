const Book = require('../model/Book');

const getAllBooks = async (req, res) => {
    const books = await Book.find().exec();
  if (!books) return res.status(204).json({ 'message': 'No books found.' });
  res.json(books);
};

module.exports = {
    getAllBooks
}