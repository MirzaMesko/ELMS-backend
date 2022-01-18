const { parse } = require('date-fns');

// const data = {
//   employees: require('../model/employees.json'),
//   setEmployees: function (data) { this.employees = data}
// }

const Employee = require('../model/Employee');

const getAllEmployees = async (req, res) => {
  const employees = await Employee.find().exec();
  if (!employees) return res.status(204).json({ 'message': 'No employees found.' });
  res.json(employees);
}

const createNewEmployee = async (req, res) => {
  // const newEmployee = {
  //   id: data.employees[data.employees.length -1].id + 1 || 1,
  //   firstname: req.body.firstname,
  //   lastname: req.body.lastname
  // }

  // if ( !newEmployee.firstname || !newEmployee.lastname ) {
  //   return res.status(400).json({ 'message': 'First and last names are required!'});
  // }
  // data.setEmployees([ ...data.employees, newEmployee]);
  // res.status(201).json(data.employees);

  if ( !req?.body?.firstname || !req?.body?.lastname ) {
       return res.status(400).json({ 'message': 'First and last names are required!'});
     };
     try {
      const result = await Employee.create({ firstname: req.body.firstname, lastname: req.body.lastname, email: req.body.email, position: req.body.position});
      res.status(201).json(result);
     } catch (err) {
       console.log(err);
     }
}

const updateEmployee = async (req, res) => {
  console.log(req.body)
  //const employee = data.employees.find(employee => employee.id === req.body.id);
  if ( !req?.body?.id ) {
    return res.status(400).json({ 'message': 'Id parameter is required!'});
  };
  const employee = await Employee.findOne({ _id: req.body.id }).exec();
  if (!employee) {
    return res.status(204).json({ 'message': `No employee matches ${req.body.id}.`});
  }
  if (req.body?.firstname) {employee.firstname = req.body.firstname};
  if (req.body?.lastname) {employee.lastname = req.body.lastname};
  if (req.body?.email) {employee.email = req.body.email};
  if (req.body?.position) {employee.position = req.body.position};
  // const filteredArray = data.employees.filter(employee => employee.id !== parseInt(req.body.id));
  // const unsortedArray = [...filteredArray, employee];
  // data.setEmployees(unsortedArray.sort((a, b) => a.id > b.id ? 1 : a.id < b.id ? -1 : 0));
  const result = await employee.save();
  res.json(result);
}

const deleteEmployee = async (req, res) => {
  //const employee = data.employees.find(employee => employee.id === req.body.id)
  if ( !req?.body?.id ) {
    return res.status(400).json({ 'message': 'Id parameter is required!'});
  };
  const employee = await Employee.findOne({ _id: req.body.id }).exec();
  if (!employee) {
    return res.status(204).json({ 'message': `No employee matches ${req.body.id}.`});
  }
  // const filteredArray = data.employees.filter(employee => employee.id !== parseInt(req.body.id));
  // data.setEmployees([...filteredArray]);
  const result = await Employee.deleteOne({ _id: req.body.id });
  res.json(result);
};

const getEmployee = async (req, res) => {
  //const employee = data.employees.find(employee => employee.id === parseInt(req.params.id));
  if ( !req?.params?.id ) {
    return res.status(400).json({ 'message': 'Id parameter is required!'});
  };
  const employee = await Employee.findOne({ _id: req.params.id }).exec();
  if (!employee) {
    return res.status(204).json({ 'message': `No employee matches ${req.body.id}.`});
  }
  res.json(employee);
};

module.exports = {
  getAllEmployees,
  updateEmployee,
  createNewEmployee,
  deleteEmployee,
  getEmployee,
}
