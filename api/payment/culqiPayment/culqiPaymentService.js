const axios = require('axios');
const config = require('config');
const { CulqiPayment } = require('./culqiPaymentModel');
const {
  createCard,
  getClientByToken,
} = require('./../culqiClient/culqiClientService');
const { setResponse } = require('../../utils');

const headers = {
  headers: {
    Authorization: `Bearer ${config.get('skCulqi')}`,
  },
};

const createCharge = async (recBody, recUser) => {
  let chargeResp;
  try {
    chargeResp = await axios.post(
      'https://api.culqi.com/v2/charges',
      recBody,
      headers,
    );
  } catch (error) {
    chargeResp = error.response;
    return setResponse(chargeResp.status, chargeResp.data.user_message, {});
  }

  const chargeData = {
    culqiInfo: chargeResp.data,
    user: recUser.id,
    amount: recBody.amount,
  };
  const charge = new CulqiPayment(chargeData);
  await charge.save();

  return setResponse(
    chargeResp.status,
    chargeResp.data.user_message,
    chargeData,
  );
};

const makePayment = async (recBody, recUser) => {
  const saved = recBody.payment.savedCard;
  const token = recBody.payment.culqiToken;
  const { clientToken } = recBody.payment;

  const selectedPlan = recBody.deliveryPlan.selectedOption;

  let dataReq = {
    amount: selectedPlan.amount,
    currency_code: selectedPlan.currency_code,
    email: recBody.email,
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

    const client = getClientByToken({ token });
    dataReq = {
      ...dataReq,
      antifraud_details: client.culqiInfo.antifrauddetails,
    };
  }
  // *Else unique charge

  const chargeResp = createCharge(dataReq, recUser);
  return chargeResp;
};

module.exports = {
  makePayment,
};
