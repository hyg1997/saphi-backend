const Service = require('./planService');

const getPlan = async (req, res) => {
  const plan = await Service.getPlan(req.params);

  return res.status(plan.status).send(plan);
};

const listPlan = async (req, res) => {
  const plans = await Service.listPlan(req.query);

  return res.status(plans.status).send(plans);
};

const createPlan = async (req, res) => {
  const plan = await Service.createPlan(req.body);

  return res.status(plan.status).send(plan);
};

module.exports = {
  listPlan,
  getPlan,
  createPlan,
};
