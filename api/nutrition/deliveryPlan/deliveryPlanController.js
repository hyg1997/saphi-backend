const Service = require('./deliveryPlanService');

const listDeliveryPlan = async (req, res) => {
  const deliveryPlans = await Service.listDeliveryPlan(req.query);

  return res.status(deliveryPlans.status).send(deliveryPlans);
};

module.exports = {
  listDeliveryPlan,
};
