// const usersDB = {
//     users: require('../model/users.json'),
//     setUsers: function (data) { this.users = data}
// };
const User = require('../model/User');

// const fsPromises = require('fs').promises;
// const path = require('path');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
    const { username, password } = req.body;
    console.log(username, password)
    if (!username || !password) return res.status(400).json({ 'message' : 'Username and password are required.' });
    //check for duplicate usernames in the db
    // const duplicate = usersDB.users.find(person => person.username === user);
    const duplicate = await User.findOne({ username: username }).exec();
    if (duplicate) return res.status(409).json({'message': 'Username already taken. Please try again.'}); // Conflict
    try {
        // encrypt the password
        const hashedPwd = await bcrypt.hash(password, 10);

        const result = await User.create({
            "username": username,
            "password": hashedPwd
        });
        console.log(result);
        res.status(201).json({ 'message': `New user ${username} created!` });

        // store the new user in users.json before swithcing to mongoDB
        // usersDB.setUsers([...usersDB.users, { 'username': user, 'roles': {'User': 2001}, 'password': hashedPwd }]);
        // await fsPromises.writeFile(
        //     path.join(__dirname, '..', 'model', 'users.json'), 
        //     JSON.stringify(usersDB.users)
        //     );
        //     console.log(usersDB.users);
        //     res.status(201).json({ 'success': `New user ${user} created!` });
    } catch (err) {
        res.status(500).json({ 'message' : err.message });
    }
}

module.exports = { handleNewUser }