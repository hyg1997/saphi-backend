const { DeliveryPlan } = require('./deliveryPlanModel');
const { setResponse } = require('../../utils');

const listDeliveryPlan = async reqQuery => {
  const deliveryPlans = await DeliveryPlan.findById(reqQuery);
  return setResponse(200, 'DeliveryPlan found.', deliveryPlans);
};

module.exports = {
  listDeliveryPlan,
};
