const config = require('config');

const { UserLog } = require('../../../auth/user/userModel');

const { setResponse, renderTemplate, sendEmail } = require('../../../utils');

const contactForm = async (reqBody, reqUser) => {
  const data = {
    email: reqUser.email,
    name: reqUser.name,
    lastName: reqUser.lastName,
    rating: 'No aplica',
    ...reqBody,
  };
  const content = await renderTemplate('contactFormEmail.html', data);
  const log = new UserLog({
    user: reqUser.id,
    type: 'contactFormEmail',
    metadata: data,
  });

  log.save();
  await sendEmail(content, config.get('emailSaphi'), reqBody.subject);

  return setResponse(200, 'Email sent', { status: 'ok' });
};

module.exports = {
  contactForm,
};
