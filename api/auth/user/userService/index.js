/* eslint-disable global-require */
const {
  listUser,
  readUser,
  readUserByFieldIds,
  createUser,
} = require('./authUser');
const { onboarding, validateOnboarding } = require('./onboarding');
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

  // Admin
  generateQueryUsers,
  listAdminUsers,
  getAdminUser,
  setMacrosOnUser,
};
