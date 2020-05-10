const { CulqiPayment } = require('./culqiPaymentModel');
const { CulqiClient } = require('../culqiClient/culqiClientModel');
const { createCard } = require('./../culqiClient/culqiClientService');
const { culqiRequest } = require('../utils');
const { setResponse } = require('../../utils');
const { URL_CULQI } = require('../../utils/constants');

const createCharge = async (reqBody, reqUser) => {
  const { error, respCulqi } = await culqiRequest(
    URL_CULQI.chargeCreate,
    reqBody,
  );
  if (error) return respCulqi;

  const chargeData = {
    culqiInfo: respCulqi.data,
    user: reqUser.id,
    amount: reqBody.amount,
    concept: reqBody.metadata.concept,
  };
  const charge = new CulqiPayment(chargeData);
  await charge.save();

  return setResponse(
    respCulqi.status,
    'Charge Created.',
    chargeData,
    respCulqi.data.user_message,
  );
};

const makePayment = async (reqBody, reqUser, itemToBuy, concept) => {
  const saved = reqBody.payment.savedCard;
  const token = reqBody.payment.culqiToken;
  const { clientToken } = reqBody.payment;

  let dataReq = {
    amount: itemToBuy.amount,
    currency_code: itemToBuy.currency_code,
    email: reqUser.email,
    source_id: token,
    metadata: { concept },
  };

  if (clientToken) {
    // * To create card

    const cardResp = createCard({ customer_id: clientToken, token_id: token });
    if (cardResp.status !== 201) {
      return cardResp;
    }
    const client = await CulqiClient.findByCardToken(cardResp.data.id);
    dataReq = {
      ...dataReq,
      antifraud_details: client.culqiInfo.antifrauddetails,
    };
  } else if (saved) {
    // * Existing card

    const client = await CulqiClient.findByCardToken(token);

    dataReq = {
      ...dataReq,
      antifraud_details: client.culqiInfo.antifrauddetails,
    };
  }
  // *Else unique charge

  const chargeResp = createCharge(dataReq, reqUser);
  return chargeResp;
};

const listPayments = async reqQuery => {
  const payments = await CulqiPayment.find(reqQuery);
  return setResponse(200, 'Payments found.', payments);
};

module.exports = {
  makePayment,
  listPayments,
};
