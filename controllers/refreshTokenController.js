// const usersDB = {
//   users: require("../model/users.json"),
//   setUsers: function (data) {
//     this.users = data;
//   },
// };

const User = require('../model/User');

const jwt = require("jsonwebtoken");
require("dotenv").config();

const handleRefreshToken = async (req, res) => {
  console.log(req);
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.status(401).json({ message: "test" });
  console.log(cookies.jwt);
  const refreshToken = cookies.jwt;

  // const userExists = usersDB.users.find(
  //   (person) => person.refreshToken === refreshToken
  // );
  const userExists = await User.findOne({ refreshToken }).exec();
  if (!userExists) return res.sendStatus(401); // Unauthorized

  //evaluate jwt

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || userExists.username !== decoded.username)
      return res.sendStatus(403);
    const roles = Object.values(userExists.roles);
    const accessToken = jwt.sign(
      {
        'UserInfo': {
          'username': decoded.username,
          'roles': roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" }
    );
    res.json({ accessToken });
  });
};

module.exports = { handleRefreshToken };
