const axios = require('axios');
const config = require('config');
const { CulqiPayment } = require('./culqiPayment');
const { setResponse } = require('../../utils');

const headers = {
  headers: {
    Authorization: `Bearer ${config.get('pkCulqi')}`,
  },
};

const createCustomer = async recBody => {
  const respCustomer = await axios.post(
    'https://api.culqi.com/v2/customers',
    recBody,
    headers,
  );
  return respCustomer;
};

const createCard = async recBody => {
  const respCard = await axios.post(
    'https://api.culqi.com/v2/cards',
    recBody,
    headers,
  );
  return respCard;
};

const createCharge = async recBody => {
  const respCharge = await axios.post(
    'https://api.culqi.com/v2/charges',
    recBody,
    headers,
  );
  return respCharge;
};

module.exports = {
  createCustomer,
  createCharge,
  createCard,
};
