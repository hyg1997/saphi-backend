const moment = require('moment');

const { Plan } = require('./planModel');
const { User } = require('../../auth/user/userModel');

const { makePayment } = require('../culqiPayment/culqiPaymentService');
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

const buyPlan = async (reqParams, reqBody, reqUser) => {
  const plan = await Plan.findById(reqParams.id);
  if (!plan) return setResponse(404, 'Plans not found.', plan);
  const newBody = {
    payment: { savedCard: false, culqiToken: reqBody.culqiToken },
  };
  const response = makePayment(newBody, reqUser, plan);
  winston.error(response);
  if (response.status === 201) {
    const planSubscription = {
      active: true,
      type: 'User Plan',
      endDate: moment().add(plan.toObject().months, 'months'),
    };
    await User.findByIdAndUpdate(reqUser.id, { planSubscription });
  }

  return response;
};

module.exports = {
  listPlan,
  getPlan,
  createPlan,
  buyPlan,
};
