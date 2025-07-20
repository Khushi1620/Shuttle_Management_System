const validator = require('validator');

const validateUser = (data)=> {
  const mandatoyField = ['firstName', 'emailId', 'password'];
  const isAllowed = mandatoyField.every((k)=> Object.keys(data).includes(k));
  if(! isAllowed) {
    throw new Error("Required field missing...!!!");
  }
  if(! validator.isEmail(data.emailId)) {
    throw new Error("Invalid email...!!!");
  }
  if (!data.emailId.endsWith("@glbitm.ac.in")) {
    throw new Error("Only GL Bajaj college emails are allowed...!!!");
  }
  if(! validator.isStrongPassword(data.password)) {
    throw new Error("Weak password...!!!");
  }
}
module.exports = validateUser;