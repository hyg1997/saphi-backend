/* eslint-disable no-param-reassign */
const { culqiRequest } = require('../utils');

const { CulqiClient } = require('./culqiClientModel');

const { setResponse } = require('../../utils');

// ! Es necesario crear una funciona aparte?
// ! Considerar usar un static del schema mongoose
// ! https://mongoosejs.com/docs/guide.html#statics
const getClientByToken = async reqBody => {
  const client = await CulqiClient.findOne({ 'cards.token': reqBody.token });
  return client;
};

const createCulqiClient = async (reqBody, reqUser) => {
  let culqiClient = await CulqiClient.findOne({
    'culqiInfo.email': reqUser.email,
  });
  if (culqiClient) {
    return setResponse(200, 'Client found.', culqiClient);
  }

  reqBody.email = reqUser.email;
  const { error, respCulqi } = await culqiRequest(
    // ! Mismo comentario que en el archivo de payment
    // ! traer las urls del objeto config
    'https://api.culqi.com/v2/customers',
    reqBody,
  );

  if (error) return respCulqi;

  const clientData = {
    user: reqUser.id,
    token: respCulqi.data.id,
    culqiInfo: respCulqi.data,
    cards: [],
  };

  culqiClient = new CulqiClient(clientData);
  await culqiClient.save();

  return setResponse(respCulqi.status, 'Client created.', culqiClient);
};

const formatCard = card => {
  return {
    token: card.token,
    card_number: card.culqiInfo.source.card_number,
    card_brand: card.culqiInfo.source.iin.card_brand,
  };
};

const listCulqiClient = async reqUser => {
  const clients = await CulqiClient.find({ user: reqUser.id });

  const cards = [];
  clients.forEach(function(client) {
    CulqiClient.updateOne();
    client.cards.forEach(function(card) {
      cards.push(formatCard(card));
    });
  });
  return setResponse(200, 'Cards found.', cards);
};

const createCard = async reqBody => {
  const { error, respCulqi } = await culqiRequest(
    // ! Mismo comentario que en el archivo de payment
    // ! traer las urls del objeto config
    'https://api.culqi.com/v2/cards',
    reqBody,
  );

  if (error) return respCulqi;

  // *Update culqiClient
  // ! En el request validar que tambien concida el userId con el user del request
  const culqiClient = await CulqiClient.findOne({ token: reqBody.customer_id });

  const cardData = {
    token: respCulqi.data.id,
    culqiInfo: respCulqi.data,
  };

  await CulqiClient.updateOne(
    { _id: culqiClient.id },
    { $push: { cards: cardData } },
  );

  return setResponse(respCulqi.status, 'Card created.', cardData);
};

module.exports = {
  getClientByToken,
  createCard,
  listCulqiClient,
  createCulqiClient,
};
