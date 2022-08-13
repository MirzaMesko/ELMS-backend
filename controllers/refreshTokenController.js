const User = require('../model/User');

const jwt = require("jsonwebtoken");
require("dotenv").config();

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.status(401).json({ message: "test" });

  const refreshToken = cookies.jwt;
  const userExists = await User.findOne({ refreshToken: refreshToken }).exec();
  if (!userExists) return res.sendStatus(401); // Unauthorized

  //evaluate jwt
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || userExists.username !== decoded.username) {
      return res.sendStatus(403);
    }
      
    const roles = Object.values(userExists.roles);
    const accessToken = jwt.sign(
      {
        'UserInfo': {
          'username': userExists.username,
          'roles': roles,
          'image': userExists.image
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "25m" }
    );
    res.json({ accessToken });
  });
};

module.exports = { handleRefreshToken };
