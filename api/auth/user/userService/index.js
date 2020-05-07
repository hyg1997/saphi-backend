/* eslint-disable global-require */
const {
  listUser,
  readUser,
  readUserByFieldIds,
  createUser,
} = require('./authUser');
const { onboarding, validateOnboarding } = require('./onboarding');
const {
  updateUser,
  validateUpdateUser,
  listPayments,
  updatePhoto,
} = require('./profile');
const { forgotPassword, checkCode, resetPassword } = require('./password');

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
  updatePhoto,
  ...require('./contactForm'),
};
