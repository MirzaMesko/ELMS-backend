const User = require('../model/User');

const handleLogout = async (req, res) => {
    // on client, also delete the accessToken
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); // No content to send back
    const refreshToken = cookies.jwt;
    // is refresh token in db?
    const userExists = await User.findOne({ refreshToken }).exec();
    if (!userExists) {
        res.clearCookie('jwt', { httpOnly: true });
        return res.sendStatus(204) // successfull but no content
    }
    userExists.refreshToken = '';
    const result = await userExists.save();
    
    res.clearCookie('jwt', { httpOnly: true }); // in production must use secure: true _ only serves on https
    res.sendStatus(204);
}

module.exports = { handleLogout }