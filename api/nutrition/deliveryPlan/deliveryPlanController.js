const Service = require('./deliveryPlanService');

const listDeliveryPlan = async (req, res) => {
  const deliveryPlans = await Service.listDeliveryPlan(req.query);

  return res.status(deliveryPlans.status).send(deliveryPlans);
};

const getDeliveryPlan = async (req, res) => {
  const deliveryPlan = await Service.getDeliveryPlan(req.params);

  return res.status(deliveryPlan.status).send(deliveryPlan);
};

const createDeliveryPlan = async (req, res) => {
  const deliveryPlan = await Service.createDeliveryPlan(req.body);

  return res.status(deliveryPlan.status).send(deliveryPlan);
};

module.exports = {
  listDeliveryPlan,
  getDeliveryPlan,
  createDeliveryPlan,
};
