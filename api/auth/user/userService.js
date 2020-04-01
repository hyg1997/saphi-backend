const _ = require('lodash');
const nodemailer = require('nodemailer');
const moment = require('moment-timezone');

const { User } = require('./userModel');
const { setResponse, renderTemplate } = require('../../utils');

const { CONFIG_EMAIL } = require('../../utils/constants');

const listUser = async reqQuery => {
  const users = await User.find();
  return setResponse(200, 'Users found.', users);
};

const readUser = async reqParams => {
  const user = await User.findById(reqParams.id);
  if (!user) return setResponse(404, 'User not found.');

  return setResponse(200, 'User found.', user);
};

const readUserByFieldIds = async reqBody => {
  const user = await User.findByIds(reqBody);
  if (!user) return setResponse(404, 'User not found.');

  return setResponse(200, 'User found.', user);
};

const createUser = async reqBody => {
  let user = await User.findByIds(reqBody);
  if (user) return setResponse(400, 'User already exists.');

  user = new User(reqBody);
  await user.save();

  user = await User.findById(user.id, { password: 0 });

  return setResponse(201, 'User created.', user);
};

const onboarding = async (reqBody, reqUser) => {
  await User.findByIdAndUpdate(reqUser.id, reqBody);
};

const getUserByPhoneOrEmail = async phoneOrEmail => {
  const emailRegex = /^.{2,}@.{2,}\..{2,}$/g;
  // TODO: Check phone regex
  const phoneRegex = /^\+?[0-9]{9,}$/g;

  let user = null;

  let email = phoneOrEmail.match(emailRegex);
  if (email) {
    [email] = email;
    user = await User.findOne({ email });
  } else email = '';

  let phone = phoneOrEmail.match(phoneRegex);
  if (phone) {
    // ? Check phonePrefix also ?
    phone = phone[0].substr(phone.length - 9, 9);
    user = await User.findOne({ phoneNumber: phone });
  } else phone = '';

  if (!user) return setResponse(404, 'User not found.', {});
  return setResponse(200, 'User found.', { user, email, phone });
};

const forgotPassword = async reqBody => {
  const response = await getUserByPhoneOrEmail(reqBody.phoneOrEmail);

  if (response.status !== 200) return response;

  const code = String(Math.floor(Math.random() * 10000)).padStart(4, '0');

  if (response.data.email) {
    const content = renderTemplate('email_send_code.html', { code });
    const transporter = nodemailer.createTransport(CONFIG_EMAIL);

    try {
      await transporter.sendMail({
        from: CONFIG_EMAIL.auth.user,
        to: response.data.email,
        subject: 'Your saphi code',
        text: content,
      });
    } catch (error) {
      return setResponse(500, 'Ocurrio un error', {});
    }
  } else {
    // TODO: Send phone
  }

  const expires = moment
    .tz('America/Lima')
    .add(1, 'hours')
    .format();
  await User.findByIdAndUpdate(response.data.user.id, {
    actionCode: { code, expires },
  });

  return setResponse(200, 'Code Sended.', {});
};

const checkCode = async reqBody => {
  const response = await getUserByPhoneOrEmail(reqBody.phoneOrEmail);
  if (response.status !== 200) return response;

  if (!response.data.user.actionCode)
    return setResponse(400, 'No code for user.', {});

  if (!response.data.user.actionCode.expires > moment.tz('America/Lima'))
    return setResponse(400, 'Expired code.', {});

  if (response.data.user.actionCode.code !== reqBody.code)
    return setResponse(400, 'Incorrect code.', {});

  return setResponse(200, 'Correct code.', {});
};

const resetPassword = async reqBody => {
  const response = await checkCode(reqBody);
  if (response.status !== 200) return response;

  await User.findOneAndUpdate(
    { 'actionCode.code': reqBody.code },
    { password: reqBody.newPassword },
  );
  return setResponse(200, 'Password updated.', {});
};

module.exports = {
  listUser,
  readUser,
  readUserByFieldIds,
  createUser,
  onboarding,
  forgotPassword,
  checkCode,
  resetPassword,
};
