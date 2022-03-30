const express = require("express");
const router = express.Router();
const EmailController = require("../controllers/emailController");
const ROLES_LIST = require('../config/roles-list');
const verifyRoles = require('../middleware/verifyRoles');

router.route('/').post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Librarian), EmailController.handleEmail);

module.exports = router;