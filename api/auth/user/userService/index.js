/* eslint-disable global-require */
const {
  listUser,
  readUser,
  readUserByFieldIds,
  createUser,
} = require('./authUser');
const { onboarding } = require('./onboarding');
const { forgotPassword, checkCode, resetPassword } = require('./password');

module.exports = {
  listUser,
  readUser,
  readUserByFieldIds,
  createUser,
  forgotPassword,
  checkCode,
  resetPassword,
  onboarding,
};
