const { DeliveryPlan } = require('./deliveryPlanModel');
const { setResponse } = require('../../utils');

const listDeliveryPlan = async reqQuery => {
  const deliveryPlans = await DeliveryPlan.find(reqQuery);
  return setResponse(200, 'DeliveryPlan found.', deliveryPlans);
};

const getDeliveryPlan = async reqParams => {
  const deliveryPlan = await DeliveryPlan.findById(reqParams.id);
  return setResponse(200, 'DeliveryPlan found.', deliveryPlan);
};

const createDeliveryPlan = async reqBody => {
  const deliveryPlan = new DeliveryPlan(reqBody);
  await deliveryPlan.save();
  return setResponse(201, 'DeliveryPlan created.', deliveryPlan);
};

module.exports = {
  listDeliveryPlan,
  getDeliveryPlan,
  createDeliveryPlan,
};
