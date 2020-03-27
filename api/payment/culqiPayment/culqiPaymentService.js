const { CulqiPayment } = require('./culqiPaymentModel');
const { CulqiClient } = require('../culqiClient/culqiClientModel');
const { createCard } = require('./../culqiClient/culqiClientService');
const { culqiRequest } = require('../utils');
const { setResponse } = require('../../utils');
const { URL_CULQI } = require('../../utils/constants');

// ! const urlCulqi = config.get('urlCulqi');

const createCharge = async (reqBody, reqUser) => {
  // ! Las URLs de servicios externos deberían estar
  // ! en los objetos development/production/test en la carpeta config
  // ! e importarse usando el paquete config
  // ! Esto debido a que el url va a cambiar según se tenga el entorno
  // ? No tendria por que cambiar por el entorno
  // ? Para eso estan las llaves de autenticacion

  const { error, respCulqi } = await culqiRequest(
    URL_CULQI.chargeCreate,
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

  // ! URGENTE Corroborar logica de los requests con LUIS
  // ! Segun entendia el bool saved indica si el token de la tarjeta sera guardada
  // ! en el cliente del token enviado

  // ! De lo que entiendo en el codigo no se sigue esa logica, sino si se manda el token
  // ! de cliente
  // ! De ser necesario no cambiar el back, pero asegurarse que LUIS crea el body
  // ! siguiendo la logica implementada

  if (clientToken !== '') {
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

module.exports = {
  makePayment,
};
