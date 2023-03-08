const User = require('../model/User');
const bcrypt = require('bcrypt');

const getAllUsers = async (req, res) => {
    const users = await User.find().exec();
  if (!users) return res.status(204).json({ 'message': 'No users found.' });
  res.json(users);
};

const updateUser = async (req, res) => {
  if ( !req?.body?.id ) {
    return res.status(400).json({ 'message': 'Id parameter is required!'});
  };
  const user = await User.findOne({ _id: req.body.id }).exec();
  if (!user) {
    return res.status(204).json({ 'message': `No employee matches ${req.body.id}.`});
  }

  if (req?.body?.email) {user.email = req.body.email};
  if (req?.body?.bio) {user.bio = req.body.bio};
  if (req?.body?.name) {user.name = req.body.name};
  if (req?.body?.image) {user.image = req.body.image};
  if (req?.body?.readingHistory) {user.readingHistory = req.body.readingHistory};
  if (req?.body?.newOwedBooks) {user.owedBooks = req.body.newOwedBooks};
  if (req?.body?.notifications) {user.notifications = req.body.notifications};
  if (req?.body?.newNotification) {user.notifications = [ ...user.notifications, { message: req.body.newNotification, timestamp: new Date(), seen: req.body.seen}]};
  if (req?.body?.roles) {
    let numRoles = {};
    req.body.roles.map(role => {
              if (role === 'Member') {
                  numRoles = {...numRoles, 'User': 'Member'}
                  }
                  if (role === 'Librarian') {
                    numRoles = {...numRoles, 'Librarian': 'Librarian'}
                      }
                      if (role === 'Admin') {
                        numRoles = {...numRoles, 'Admin': 'Admin'}
                          }
              })
    user.roles = await numRoles;
  };
  const result = await user.save();
  
  res.json(result);
}

const deleteUser = async (req, res) => {
    if ( !req?.body?.id ) {
        return res.status(400).json({ 'message': 'Id parameter is required!'});
      };
      const user = await User.findOne({ _id: req.body.id }).exec();
      if (!user) {
        return res.status(204).json({ 'message': `No user matches ${req.body.id}.`});
      }
      const result = await User.deleteOne({ _id: req.body.id });
  res.json(result);
}

const createNewUser = async (req, res) => {
  
  if ( !req?.body?.username || !req?.body?.password ) {
       return res.status(400).json({ 'message': 'Username and password are required!'});
     };
     const user = await User.findOne({ username: req.body.username }).exec();
      if (user) {
        return res.status(400).json({ 'message': `Username is already taken. Try another one.`});
      }
     let numRoles = {};
    req.body.roles.map(role => {
              if (role === 'Member') {
                  numRoles = {...numRoles, 'User': 'Member'}
                  }
                  if (role === 'Librarian') {
                    numRoles = {...numRoles, 'Librarian': 'Librarian'}
                      }
                      if (role === 'Admin') {
                        numRoles = {...numRoles, 'Admin': 'Admin'}
                          }
              })
    await numRoles;
     try {
       // encrypt the password
       const hashedPwd = await bcrypt.hash(req.body.password, 10);

      const result = await User.create({ username: req.body.username, 
        password: hashedPwd, email: req.body.email, roles: numRoles, image: req.body.image,
        bio: req.body.bio, name: req.body.name});
      res.status(201).json(result);
     } catch (err) {
         return err
     }
}

module.exports = {
    getAllUsers,
    deleteUser,
    updateUser,
    createNewUser
}
