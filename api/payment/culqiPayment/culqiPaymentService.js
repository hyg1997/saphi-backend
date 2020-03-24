const { CulqiPayment } = require('./culqiPaymentModel');
const {
  createCard,
  getClientByToken,
} = require('./../culqiClient/culqiClientService');
const { culqiRequest } = require('../utils');
const { setResponse } = require('../../utils');

const createCharge = async (reqBody, reqUser) => {
  const { error, respCulqi } = await culqiRequest(
    'https://api.culqi.com/v2/charges',
    reqBody,
  );
  if (error) return respCulqi;

  const chargeData = {
    culqiInfo: respCulqi.data,
    user: reqUser.id,
    amount: reqBody.amount,
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

const makePayment = async (reqBody, reqUser) => {
  const saved = reqBody.payment.savedCard;
  const token = reqBody.payment.culqiToken;
  const { clientToken } = reqBody.payment;

  const selectedPlan = reqBody.deliveryPlan.selectedOption;

  let dataReq = {
    amount: selectedPlan.amount,
    currency_code: selectedPlan.currency_code,
    email: reqUser.email,
    source_id: token,
  };
  if (clientToken !== '') {
    // * To create card

    const cardResp = createCard({ customer_id: clientToken, token_id: token });
    if (cardResp.status !== 201) {
      return cardResp;
    }
    const client = getClientByToken({ token: cardResp.data.id });
    dataReq = {
      ...dataReq,
      antifraud_details: client.culqiInfo.antifrauddetails,
    };
  } else if (saved) {
    // * Existing card

    const client = await getClientByToken({ token });

    dataReq = {
      ...dataReq,
      antifraud_details: client.culqiInfo.antifrauddetails,
    };
  }
  // *Else unique charge

  const chargeResp = createCharge(dataReq, reqUser);
  return chargeResp;
};

module.exports = {
  makePayment,
};
