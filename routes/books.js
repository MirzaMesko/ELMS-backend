const express = require("express");
const router = express.Router();
const BooksController = require("../controllers/BooksController");
// const ROLES_LIST = require('../config/roles-list');
// const verifyRoles = require('../middleware/verifyRoles');

router.route("/").get(BooksController.getAllBooks)

module.exports = router;