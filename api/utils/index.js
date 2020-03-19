/* eslint-disable no-param-reassign */
/* eslint-disable global-require */
/* eslint-disable no-await-in-loop */
const fs = require('fs');
const path = require('path');

const setResponse = (status, message = '', data = null, clientMessage) => {
  if (!clientMessage) clientMessage = message;
  return { data, status, message, clientMessage };
};

const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index += 1) {
    await callback(array[index], index, array);
  }
};
// const renderTemplate = async (filename, data) => {
//   const source = fs.readFileSync(
//     path.join(__dirname, '../../templates', filename),
//     'utf-8',
//   );
//   const template = handlebars.compile(source);
//   return template(data);
// };

module.exports = {
  setResponse,
  asyncForEach,
  addBussinesDays: require('./addBussinesDays'),
  // renderTemplate,
};
