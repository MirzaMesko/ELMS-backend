const Book = require('../model/Book');

const getAllBooks = async (req, res) => {
    const books = await Book.find().exec();
  if (!books) return res.status(204).json({ 'message': 'No books found.' });
  res.json(books);
};

const getBookById = async (req, res) => {
  const book = await Book.findOne({ _id: req.params.id}).exec();
if (!book) return res.status(204).json({ 'message': 'No book found.' });
res.json(book);
};

const createNewBook = async (req, res) => {
  
  if ( !req?.body?.serNo ) {
       return res.status(200).json({ 'message': 'Serial number is required!' });
     };
     const book = await Book.findOne({ serNo: req.body.serNo }).exec();
      if (book) {
        return res.status(200).json({ 'message': 'The serial number you entered is already in use!' });
      }
     try {

      const result = await Book.create({ title: req.body.title, 
        author: req.body.author, year: req.body.year, description: req.body.description, category: req.body.category,
        serNo: req.body.serNo, image: req.body.image, publisher: req.body.publisher});
        console.log(result);
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

const updateMultipleBooks = async (req, res) => {
  if ( !req?.body?.title ) {
    return res.status(400).json({ 'message': 'Title parameter is required!'});
  };

  const book = await Book.findOne({ title: req.body.title }).exec();
  if (!book) {
    return res.status(204).json({ 'message': `No book with title "${req.body.title}".`});
  }

  let result = [];

  if (req?.body?.reviews) {
    result = await Book.updateMany({ title: req.body.title}, {reviews: req.body.reviews} ).exec();
  };

  if (req?.body?.newRating) 
  {
    result = await Book.updateMany({ title: req.body.title}, {rating: [ ...book.rating, { userId: req.body.newRating.userId, rating: req.body.newRating.value} ]} ).exec();
  }

  if (req?.body?.newReview) {
    let response = await Book.updateMany({ title: req.body.title}, {reviews: [ ...book.reviews, { userId: req.body.newReview.userId, timestamp: new Date().toDateString(), review: req.body.newReview.review} ]} ).exec();
    if (response.acknowledged) {
    result = { userId: req.body.newReview.userId, timestamp: new Date().toDateString(), review: req.body.newReview.review};
  }
  };
  
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
  res.status(200).json(result);
};

module.exports = {
    getAllBooks,
    getBookById, 
    createNewBook,
    updateBook,
    updateMultipleBooks, 
    deleteBook
}