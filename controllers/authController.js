const User = require("../model/User");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const handleLogin = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  const userExists = await User.findOne({ username: username }).exec();
   if (!userExists) {
     res.status(401).json({ message: "Incorrect username or password! Please try again." }); // Unauthorized
     return
   }
 
  //evaluate password
  const match = await bcrypt.compare(password, userExists.password);
  if (!match) {
    return res.status(401).json({ message: "Incorrect username or password! Please try again." });
  }

  // create JWTs
  const roles = userExists.roles;
  const accessToken = jwt.sign(
    {
      UserInfo: {
        username: userExists.username,
        roles: roles,
        image: userExists.image,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "25m" }
  );
  const refreshToken = jwt.sign(
    { username: userExists.username },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "1d" }
  );

  //saving refreshToken to user in MongoDB collection
  userExists.refreshToken = refreshToken;
  const result = await userExists.save();

  res.cookie("jwt", refreshToken, {
    httpOnly: false,
    secure: true,
    maxAge: 24 * 60 * 60 * 1000,
    domain: '.meskovic.dev',
    // path: '/'
  }); // secure: true  - must be used in production for chrome to work!!
  res.json({ accessToken });
};

module.exports = { handleLogin };
