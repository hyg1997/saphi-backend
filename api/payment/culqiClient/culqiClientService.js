const axios = require('axios');
const config = require('config');
const { CulqiClient } = require('./culqiClientModel');

const { setResponse } = require('../../utils');

const headers = {
  headers: {
    Authorization: `Bearer ${config.get('skCulqi')}`,
  },
};

const getClientByToken = async recBody => {
  const client = await CulqiClient.findOne({ 'cards.token': recBody.token });
  return client;
};

const createCulqiClient = async (recBody, recUser) => {
  let respClient;
  try {
    respClient = await axios.post(
      'https://api.culqi.com/v2/customers',
      recBody,
      headers,
    );
  } catch (error) {
    respClient = error.response;
    return setResponse(respClient.status, 'Error', {});
  }

  const clientData = {
    user: recUser.id,
    token: respClient.data.id,
    culqiInfo: respClient.data,
    cards: [],
  };

  const culqiClient = new CulqiClient(clientData);
  await culqiClient.save();

  return setResponse(respClient.status, 'Client created.', culqiClient);
};

const formatCard = async card => {
  return {
    token: card.token,
    card_number: card.culqiInfo.token.card_number,
    card_brand: card.culqiInfo.token.iin.card_brand,
  };
};

const listCulqiClient = async recUser => {
  const clients = await CulqiClient.find({ user: recUser.id });
  const cards = [];
  clients.forEach(function(client) {
    client.cards.forEach(function(card) {
      cards.push(formatCard(card));
    });
  });
  return setResponse(200, 'Cards found.', cards);
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

  return setResponse(respCard.status, 'Card created.', cardData);
};

module.exports = {
  getClientByToken,
  createCard,
  listCulqiClient,
  createCulqiClient,
};
