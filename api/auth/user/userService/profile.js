/* eslint-disable no-param-reassign */
const _ = require('lodash');
const { User } = require('../userModel');
const { Diet } = require('../../../nutrition/diet/dietModel');
const {
  CulqiPayment,
} = require('../../../payment/culqiPayment/culqiPaymentModel');
const { setResponse } = require('../../../utils');

const validateUpdateUser = async (reqBody, reqUser) => {
  const user = await User.findById(reqUser.id);
  if (reqBody.pastPassword && reqBody.newPassword) {
    if (!user.isValidPassword(reqBody.pastPassword))
      return setResponse(400, 'Incorrect password', {});
    reqBody.password = reqBody.newPassword;
    delete reqBody.newPassword;
    delete reqBody.pastPassword;
  }

  return setResponse(200, 'Ok', { reqBody, user });
};

const updateUser = async (reqBody, user) => {
  _.merge(user, reqBody);
  await user.save();
  return setResponse(200, 'User updated.', user);
};

const listPayments = async userId => {
  const payments = await CulqiPayment.find({ user: userId });
  return setResponse(200, 'Payments found.', payments);
};

const listDiets = async userId => {
  const diets = await Diet.find({ user: userId }, 'macroContent indicators')
    .sort({ createdAt: -1 })
    .exec('find');
  return setResponse(200, 'Diets found.', diets);
};

module.exports = {
  updateUser,
  validateUpdateUser,
  listPayments,
  listDiets,
};
