const USERS = {
  valid: {
    id: 1,
    name: 'emi',
    email: 'emi@yopmail.com',
    password: '123456',
  },    
  invalidPassword: {
    id: 2,
    name: 'emi',
    email: 'emi@yopmail.com',
    password: 'wrongpassword',
  }
};
const errorMessages = {
  invalidCredentials: 'Your email or password is incorrect!',
};

module.exports = { USERS, errorMessages };