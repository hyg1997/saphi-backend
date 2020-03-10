const { DeliveryPlan } = require('./deliveryPlanModel');
const { setResponse } = require('../../utils');

const listDeliveryPlan = async reqQuery => {
  const deliveryPlans = await DeliveryPlan.findById(reqQuery);
  return setResponse(200, 'DeliveryPlan found.', deliveryPlans);
};

const getDeliveryPlan = async reqParams => {
  const deliveryPlan = await DeliveryPlan.findById(reqParams);
  return setResponse(200, 'DeliveryPlan found.', deliveryPlan);
};

const createDeliveryPlan = async reqBody => {
  const deliveryPlan = await DeliveryPlan.findById(reqBody);
  return setResponse(201, 'DeliveryPlan created.', deliveryPlan);
};

module.exports = {
  listDeliveryPlan,
  getDeliveryPlan,
  createDeliveryPlan,
};
