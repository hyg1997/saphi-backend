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

const formatCard = card => {
  return {
    token: card.token,
    card_number: card.culqiInfo.source.card_number,
    card_brand: card.culqiInfo.source.iin.card_brand,
  };
};

const listCulqiClient = async recUser => {
  const clients = await CulqiClient.find({ user: recUser.id });

  const cards = [];
  clients.forEach(function(client) {
    CulqiClient.updateOne();
    client.cards.forEach(function(card) {
      cards.push(formatCard(card));
    });
  });
  return setResponse(200, 'Cards found.', cards);
};

const createCard = async recBody => {
  let respCard;
  try {
    respCard = await axios.post(
      'https://api.culqi.com/v2/cards',
      recBody,
      headers,
    );
  } catch (error) {
    respCard = error.response;
    return setResponse(respCard.status, 'Error', {});
  }

  // *Update culqiClient
  const culqiClient = await CulqiClient.findOne({ token: recBody.customer_id });

  const cardData = {
    token: respCard.data.id,
    culqiInfo: respCard.data,
  };

  await CulqiClient.updateOne(
    { _id: culqiClient.id },
    { $push: { cards: cardData } },
  );

  return setResponse(respCard.status, 'Card created.', cardData);
};

module.exports = {
  getClientByToken,
  createCard,
  listCulqiClient,
  createCulqiClient,
};
