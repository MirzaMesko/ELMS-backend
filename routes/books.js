const express = require("express");
const router = express.Router();
const BooksController = require("../controllers/booksController");
const ROLES_LIST = require('../config/roles-list');
const verifyRoles = require('../middleware/verifyRoles');

router.route("/review").put(BooksController.updateMultipleBooks)

router.route("/rate").put(BooksController.updateMultipleBooks)

router.route("/:id").get(BooksController.getBookById)

router.route("/").get(BooksController.getAllBooks)
.post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Librarian), BooksController.createNewBook)
.put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Librarian), BooksController.updateBook)
.delete(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Librarian), BooksController.deleteBook)

module.exports = router;