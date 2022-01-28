const Book = require('../model/Book');

const getAllBooks = async (req, res) => {
    const books = await Book.find().exec();
  if (!books) return res.status(204).json({ 'message': 'No books found.' });
  res.json(books);
};

const createNewBook = async (req, res) => {
  
  if ( !req?.body?.serNo ) {
       return res.status(400).json({ 'message': 'Serial number is required!'});
     };
     const book = await Book.findOne({ serNo: req.body.serNo }).exec();
      if (book) {
        return res.status(400).json({ 'message': `A book with this serial number already exists in the database!`});
      }
     try {

      const result = await Book.create({ title: req.body.title, 
        author: req.body.author, year: req.body.year, description: req.body.description, 
        serNo: req.body.serNo, publisher: req.body.publisher});
      res.status(201).json(result);
     } catch (err) {
       console.log(err);
     }
}

module.exports = {
    getAllBooks, 
    createNewBook
}