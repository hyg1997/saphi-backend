/* eslint-disable no-param-reassign */
/* eslint-disable global-require */
/* eslint-disable no-await-in-loop */
const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');

const setResponse = (status, message = '', data = null, clientMessage) => {
  if (!clientMessage) clientMessage = message;
  return { data, status, message, clientMessage };
};

const validatePagination = (total, page, size) => {
  let ok = false;
  let message = '';
  let skip = 0;
  let numPages = 0;
  if (page <= 0) message = 'Page Error';
  else if (size <= 0) message = 'Size Error';
  else if (page !== 1 && (page - 1) * size >= total)
    message = 'Greater than limit page';
  else {
    ok = true;
    skip = (page - 1) * size;
    numPages = Math.max(Math.ceil(total / size), 1);
  }

  return { ok, skip, message, numPages };
};

const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index += 1) {
    await callback(array[index], index, array);
  }
};

const renderTemplate = async (filename, data) => {
  const source = fs.readFileSync(
    path.join(__dirname, '../../templates', filename),
    'utf-8',
  );
  const template = handlebars.compile(source);
  return template(data);
};

module.exports = {
  setResponse,
  asyncForEach,
  validatePagination,
  addBussinesDays: require('./addBussinesDays'),
  renderTemplate,
};
