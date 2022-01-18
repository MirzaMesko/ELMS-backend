const express = require("express");
const router = express.Router();
const UsersController = require("../controllers/UsersController");
const ROLES_LIST = require('../config/roles-list');
const verifyRoles = require('../middleware/verifyRoles');

router.route("/").get(UsersController.getAllUsers)
.post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Librarian), UsersController.createNewUser)
.put(verifyRoles(ROLES_LIST.Admin),UsersController.updateUser)
 .delete(verifyRoles(ROLES_LIST.Admin), UsersController.deleteUser);

// router.route("/:id").get(EmployeesController.getEmployee);

module.exports = router;