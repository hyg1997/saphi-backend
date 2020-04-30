const config = require('config');
const nodemailer = require('nodemailer');
const moment = require('moment-timezone');

const { User } = require('../userModel');
const { setResponse, renderTemplate, sendEmail } = require('../../../utils');

const { CONFIG_EMAIL } = require('../../../utils/constants');

const getUserByEmail = async email => {
  const user = await User.findOne({ email });
  if (!user) return setResponse(404, 'User not found.', {});
  return setResponse(200, 'User found.', user);
};

const forgotPassword = async reqBody => {
  const response = await getUserByEmail(reqBody.email);

  if (response.status !== 200) return response;

  const code = String(Math.floor(Math.random() * 10000)).padStart(4, '0');

  const domain = config.get('hostname');
  const content = await renderTemplate('email_send_code.html', {
    code,
    domain,
  });

  try {
    await sendEmail(content, reqBody.email, 'Tu Codigo Saphi');
  } catch (error) {
    return setResponse(503, 'Ocurrio un error', {});
  }

  const expires = moment
    .tz('America/Lima')
    .add(10, 'minutes')
    .format();
  await User.findByIdAndUpdate(response.data.id, {
    actionCode: { code, expires },
  });

  return setResponse(200, 'Code Sended.', {});
};

const checkCode = async reqBody => {
  const response = await getUserByEmail(reqBody.email);
  if (response.status !== 200) return response;

  if (!response.data.actionCode)
    return setResponse(400, 'No code for user.', {});

  if (!response.data.actionCode.expires > moment.tz('America/Lima'))
    return setResponse(400, 'Expired code.', {});

  if (response.data.actionCode.code !== reqBody.code)
    return setResponse(400, 'Incorrect code.', {});

  return setResponse(200, 'Correct code.', response.data);
};

const resetPassword = async reqBody => {
  const response = await checkCode(reqBody);
  if (response.status !== 200) return response;

  response.data.password = reqBody.newPassword;
  await response.data.save();

  return setResponse(200, 'Password updated.', {});
};

module.exports = {
  forgotPassword,
  checkCode,
  resetPassword,
};
