/* eslint-disable global-require */
const {
  listUser,
  readUser,
  readUserByFieldIds,
  createUser,
} = require('./authUser');
const { onboarding, validateOnboarding } = require('./onboarding');
const { updateUser, validateUpdateUser, listPayments } = require('./profile');
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
  onboarding,
  validateOnboarding,
  // Password
  forgotPassword,
  checkCode,
  resetPassword,
  // Profile
  updateUser,
  validateUpdateUser,
  listPayments,
  // Admin
  generateQueryUsers,
  listAdminUsers,
  getAdminUser,
  setMacrosOnUser,
  ...require('./contactForm'),
};
