const { Plan } = require('./planModel');
const { setResponse } = require('../../utils');

const getPlan = async reqParams => {
  const plan = await Plan.findById(reqParams.id);
  if (!plan) return setResponse(404, 'Plan not found.', {});
  return setResponse(200, 'Plan Found.', plan);
};

const createPlan = async reqBody => {
  const plan = new Plan(reqBody);
  await plan.save();
  return setResponse(201, 'Plan Created.', plan);
};

const listPlan = async reqQuery => {
  const plans = await Plan.find(reqQuery);
  return setResponse(200, 'Plans Found.', plans);
};

module.exports = {
  listPlan,
  getPlan,
  createPlan,
};
