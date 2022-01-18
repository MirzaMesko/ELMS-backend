const User = require('../model/User');

const getAllUsers = async (req, res) => {
    const users = await User.find().exec();
  if (!users) return res.status(204).json({ 'message': 'No users found.' });
  res.json(users);
};

const updateUser = async (req, res) => {
  //const employee = data.employees.find(employee => employee.id === req.body.id);
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
  // const filteredArray = data.employees.filter(employee => employee.id !== parseInt(req.body.id));
  // const unsortedArray = [...filteredArray, employee];
  // data.setEmployees(unsortedArray.sort((a, b) => a.id > b.id ? 1 : a.id < b.id ? -1 : 0));
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
      const result = await User.create({ username: req.body.username, 
        password: req.body.password, email: req.body.email, roles: numRoles, 
        bio: req.body.bio, name: req.body.name});
      res.status(201).json(result);
     } catch (err) {
       console.log(err);
     }
}

module.exports = {
    getAllUsers,
    deleteUser,
    updateUser,
    createNewUser
}