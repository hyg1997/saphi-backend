/* eslint-disable global-require */
const winston = require('winston');
const axios = require('axios');

require('../../../startup/config')();
require('../../../startup/logging')();

const config = require('config');

const headers = {
  headers: {
    Authorization: `Bearer ${config.get('skCulqi')}`,
  },
};

const deleteUser = async id => {
  const respCulqi = await axios.delete(
    `https://api.culqi.com/v2/customers/${id}`,
    {},
    headers,
  );
  winston.info(`Customer ${id} deleted!`);
};

const cleanAllUsers = async () => {
  try {
    const respCulqi = await axios.get(
      'https://api.culqi.com/v2/customers/',
      {},
      headers,
    );
  } catch (error) {
    console.log(error.response.status);
    console.log(error.response.data);
  }

  console.log(respCulqi.data);
};

cleanAllUsers();
