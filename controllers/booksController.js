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
        author: req.body.author, year: req.body.year, description: req.body.description, category: req.body.category,
        serNo: req.body.serNo, image: req.body.image, publisher: req.body.publisher});
      res.status(201).json(result);
     } catch (err) {
       console.log(err);
     }
};

const updateBook = async (req, res) => {
  if ( !req?.body?.id ) {
    return res.status(400).json({ 'message': 'Id parameter is required!'});
  };
  const book = await Book.findOne({ _id: req.body.id }).exec();
  if (!book) {
    return res.status(204).json({ 'message': `No book matches ${req.body.id}.`});
  }

  if (req?.body?.title) {book.title = req.body.title};
  if (req?.body?.author) {book.author = req.body.author};
  if (req?.body?.year) {book.year = req.body.year};
  if (req?.body?.description) {book.description = req.body.description};
  if (req?.body?.category) {book.category = req.body.category};
  if (req?.body?.image) {book.image = req.body.image};
  if (req?.body?.publisher) {book.publisher = req.body.publisher};
  if (req?.body?.serNo) {book.serNo = req.body.serNo};
  if (req?.body?.available) {book.available = req.body.available};
  if (req?.body?.owedBy) {book.owedBy = req.body.owedBy};
  if (req?.body?.reservedBy) {book.reservedBy = req.body.reservedBy};
  
  
  const result = await book.save();
  
  res.status(200).json(result);
};

const deleteBook = async (req, res) => {
  if ( !req?.body?.id ) {
    return res.status(400).json({ 'message': 'Id parameter is required!'});
  };
  const book = await Book.findOne({ _id: req.body.id }).exec();
  if (!book) {
    return res.status(204).json({ 'message': `No book matches ${req.body.id}.`});
  }
  
  const result = await Book.deleteOne({ _id: req.body.id });
  res.json(result);
};

module.exports = {
    getAllBooks, 
    createNewBook,
    updateBook, 
    deleteBook
}