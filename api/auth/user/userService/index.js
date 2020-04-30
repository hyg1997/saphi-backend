/* eslint-disable global-require */
const {
  listUser,
  readUser,
  readUserByFieldIds,
  createUser,
} = require('./authUser');
const {
  onboarding,
  validateOnboarding,
  updateUser,
  validateUpdateUser,
} = require('./onboarding');
const { forgotPassword, checkCode, resetPassword } = require('./password');
const {
  generateQueryUsers,
  listAdminUsers,
  getAdminUser,
  setMacrosOnUser,
} = require('./admin');

module.exports = {
  listUser,
  readUser,
  readUserByFieldIds,
  createUser,
  forgotPassword,
  checkCode,
  resetPassword,
  onboarding,
  validateOnboarding,

  updateUser,
  validateUpdateUser,
  // Admin
  generateQueryUsers,
  listAdminUsers,
  getAdminUser,
  setMacrosOnUser,
  ...require('./contactForm'),
};
