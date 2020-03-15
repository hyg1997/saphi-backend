const axios = require('axios');
const config = require('config');
const { CulqiClient } = require('./culqiClientModel');

const { setResponse } = require('../../utils');

const headers = {
  headers: {
    Authorization: `Bearer ${config.get('pkCulqi')}`,
  },
};

const getClientByToken = async recBody => {
  const client = await CulqiClient.findOne({ 'cards.token': recBody.token });
  return client;
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

  if (respCard !== 201) {
    return setResponse(respCard.status, 'Error', respCard.data);
  }

  // *Update culqiClient
  const culqiClient = await CulqiClient.findOne({ token: recBody.customer_id });
  const cardData = {
    token: respCard.id,
    culqiInfo: respCard,
  };
  culqiClient.cards.push(cardData);
  culqiClient.save();

  return setResponse(respCard.status, 'Exito', cardData);
};

exports = {
  getClientByToken,
  createCard,
};
