const _ = require('lodash');
const axios = require('axios');
const config = require('config');
const winston = require('winston');
const { setResponse } = require('../../utils');

const headers = {
  headers: {
    Authorization: `Bearer ${config.get('skCulqi')}`,
  },
};

const culqiRequest = async (url, reqBody) => {
  let respCulqi;
  try {
    respCulqi = await axios.post(url, reqBody, headers);
  } catch (error) {
    respCulqi = error.response;
    winston.error(error);
    return {
      error: true,
      respCulqi: setResponse(
        respCulqi.status,
        _.get(respCulqi, 'data.merchant_message', 'Error de culqi.'),
        {},
        _.get(
          respCulqi,
          'data.user_message',
          'Hubo un error en la operación. Contáctanos para ayudarte.',
        ),
      ),
    };
  }
  return { error: false, respCulqi };
};

module.exports = {
  culqiRequest,
};
