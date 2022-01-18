// const usersDB = {
//     users: require('../model/users.json'),
//     setUsers: function (data) { this.users = data}
// };
const User = require('../model/User');

// const fsPromises = require('fs').promises;
// const path = require('path');

const handleLogout = async (req, res) => {
    // on client, also delete the accessToken
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); // No content to send back
    const refreshToken = cookies.jwt;

    // is refresh token in db?
    //const userExists = usersDB.users.find(person => person.refreshToken === refreshToken);
    const userExists = await User.findOne({ refreshToken }).exec();
    if (!userExists) {
        res.clearCookie('jwt', { httpOnly: true });
        return res.sendStatus(204) // successfull but no content
    }
    
    // delete the refreshToken in the users.json before MongoDB

    // const otherUsers = usersDB.users.filter(person => person.refreshToken !== userExists.refreshToken );
    // const currentUser = { ...userExists, refreshToken: '' };
    // usersDB.setUsers([ ...otherUsers, currentUser ]);
    // await fsPromises.writeFile(path.join(__dirname, '..', 'model', 'users.json'), JSON.stringify(usersDB.users));
    
    userExists.refreshToken = '';
    const result = await userExists.save();
    console.log(result);
    
    res.clearCookie('jwt', { httpOnly: true }); // in production must use secure: true _ only serves on https
    res.sendStatus(204);
}

module.exports = { handleLogout }