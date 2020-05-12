/* eslint-disable no-param-reassign */
const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const { uploadImage } = require('../../../utils/aws');
const { User } = require('../userModel');
const { Diet } = require('../../../nutrition/diet/dietModel');
const {
  CulqiPayment,
} = require('../../../payment/culqiPayment/culqiPaymentModel');
const { setResponse } = require('../../../utils');

const validateUpdateUser = async (reqBody, reqUser) => {
  const user = await User.findById(reqUser.id);
  if (reqBody.pastPassword && reqBody.newPassword) {
    const validation = await user.isValidPassword(reqBody.pastPassword);
    if (!validation) return setResponse(400, 'Incorrect password', {});
    reqBody.password = reqBody.newPassword;
    delete reqBody.newPassword;
    delete reqBody.pastPassword;
  }

  return setResponse(200, 'Ok', { reqBody, user });
};

const updateUser = async (reqBody, user) => {
  _.mergeWith(user, reqBody, (objValue, srcValue) => {
    if (_.isArray(objValue)) {
      return srcValue;
    }
  });
  user.markModified('avoidedAliments');
  user.markModified('notifications');

  if (reqBody.password)
    user.password = await User.hashPassword(reqBody.password);
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

const updatePhoto = async (reqUser, file) => {
  const ext = path.extname(file.originalname);
  let type = 'image/jpeg';
  if (ext === 'png') type = 'image/png';
  const key = `user-profile/${reqUser.id}/photo${ext}`;

  let photo = '';
  try {
    photo = await uploadImage(key, file, type);
  } catch (e) {
    //
  }
  fs.unlinkSync(file.path);
  if (!photo) return setResponse(500, 'Error uploading object', {});
  reqUser.photo = photo;
  await reqUser.save();
  return setResponse(200, 'Photo updated.', { photo });
};

module.exports = {
  updateUser,
  validateUpdateUser,
  listPayments,
  listDiets,
  updatePhoto,
};
