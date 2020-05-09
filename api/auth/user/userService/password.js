const config = require('config');
const moment = require('moment-timezone');

const { User } = require('../userModel');
const { setResponse, renderTemplate, sendEmail } = require('../../../utils');
const { readUserByFieldIds } = require('./authUser');

const forgotPassword = async reqBody => {
  const response = await readUserByFieldIds(reqBody);

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

  return setResponse(200, 'Code Sended.', { status: 'ok' });
};

const checkCode = async reqBody => {
  const response = await readUserByFieldIds(reqBody);
  if (response.status !== 200) return response;

  if (!response.data.actionCode)
    return setResponse(400, 'No code for user.', {});

  if (!response.data.actionCode.expires > moment.tz('America/Lima'))
    return setResponse(400, 'Expired code.', {});

  if (response.data.actionCode.code !== reqBody.code)
    return setResponse(400, 'Incorrect code.', {});

  return setResponse(200, 'Correct code.', { status: 'ok' });
};

const resetPassword = async reqBody => {
  const response = await checkCode(reqBody);
  if (response.status !== 200) return response;

  const { data: user } = await readUserByFieldIds(reqBody);

  user.password = await User.hashPassword(reqBody.newPassword);

  // response.data.password = reqBody.newPassword;
  await user.save();

  return setResponse(200, 'Password updated.', { status: 'ok' });
};

module.exports = {
  forgotPassword,
  checkCode,
  resetPassword,
};
