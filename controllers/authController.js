// const usersDB = {
//   users: require("../model/users.json"),
//   setUsers: function (data) {
//     this.users = data;
//   },
// };

const User = require('../model/User');

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
// require("dotenv").config();
// const fsPromises = require("fs").promises;
// const path = require("path");

const handleLogin = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  // const hashedPwd = await bcrypt.hash(password, 10);
  // const userExists = await usersDB.users.find(
  //   (person) => person.username === user
  // );
  const userExists = await User.findOne({ username: username }).exec();
  if (!userExists) return res.sendStatus(401); // Unauthorized

  //evaluate password
  const match = await bcrypt.compare(password, userExists.password);
  if (!match)
    return res
      .status(401)
      .json({ message: "Incorrect username or password! Please try again." });

  // create JWTs
  const roles = userExists.roles;
  const accessToken = jwt.sign(
    {
      'UserInfo': {
        'username': userExists.username,
        'roles': roles
      }
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "25m" }
  );
  const refreshToken = jwt.sign(
    { username: userExists.username },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "1d" }
  );
  // saving refreshToken with current user in users.josn before MongoDB
  // const currentUser = { ...userExists, refreshToken };
  // usersDB.setUsers([...otherUsers, currentUser]);
  // await fsPromises.writeFile(
  //   path.join(__dirname, "..", "model", "users.json"),
  //   JSON.stringify(usersDB.users)
  // );

  //saving refreshToken to user in MongoDB collection
  userExists.refreshToken = refreshToken;
  const result = await userExists.save();

  res.cookie("jwt", refreshToken, {
    httpOnly: false,
    secure: true,
    maxAge: 24 * 60 * 60 * 1000,
  }); // secure: true  - must be used in production for chrome to work!!
  res.json({ accessToken });
};

module.exports = { handleLogin };
