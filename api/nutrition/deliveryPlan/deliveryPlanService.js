const { DeliveryPlan } = require('./deliveryPlanModel');
const { setResponse } = require('../../utils');

const listDeliveryPlan = async reqQuery => {
  const deliveryPlans = await DeliveryPlan.find(reqQuery).sort('displayOrder');
  return setResponse(200, 'DeliveryPlans found.', deliveryPlans);
};

const getDeliveryPlan = async reqParams => {
  const deliveryPlan = await DeliveryPlan.findById(reqParams.id);
  if (!deliveryPlan) return setResponse(404, 'DeliveryPlan not found.', {});
  return setResponse(200, 'DeliveryPlan found.', deliveryPlan);
};

const createDeliveryPlan = async reqBody => {
  const deliveryPlan = new DeliveryPlan(reqBody);
  // ! Que pasa si la estrucutra del request no es correcta
  await deliveryPlan.save();
  return setResponse(201, 'DeliveryPlan created.', deliveryPlan);
};

module.exports = {
  listDeliveryPlan,
  getDeliveryPlan,
  createDeliveryPlan,
};
