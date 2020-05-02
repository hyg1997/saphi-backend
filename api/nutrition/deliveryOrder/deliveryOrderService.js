/* eslint-disable no-param-reassign */
const { DeliveryOrder } = require('./deliveryOrderModel');
const { DeliveryPlan } = require('../deliveryPlan/deliveryPlanModel');
const { setResponse } = require('../../utils');

const validateDeliveryOrder = async reqBody => {
  const deliveryPlan = await DeliveryPlan.findById(reqBody.deliveryPlan);
  if (!deliveryPlan) return setResponse(404, 'DeliveryPlan not found.');

  reqBody.deliveryPlan = deliveryPlan.toObject();

  reqBody.deliveryPlan.selectedOption = reqBody.deliveryPlan.option.find(
    obj => obj.planType === reqBody.deliveryPlanType,
  );
  return setResponse(200, 'DeliveryPlan found.', deliveryPlan);
};

const createDeliveryOrder = async (reqBody, reqUser) => {
  const deliveryOrder = await DeliveryOrder.create({
    user: reqUser.id,
    ...reqBody,
  });

  return setResponse(200, 'DeliveryOrder created.', deliveryOrder);
};

const getUserDeliveryOrder = async reqUser => {
  const deliveryOrder = await DeliveryOrder.find({
    user: reqUser.id,
  })
    .sort({ createdAt: -1 })
    .limit(1);

  if (deliveryOrder.length === 0)
    return setResponse(404, 'Not DeliveryOrder found.', {});

  return setResponse(200, 'DeliveryOrder found.', deliveryOrder[0]);
};

module.exports = {
  createDeliveryOrder,
  getUserDeliveryOrder,
  // * Other
  validateDeliveryOrder,
};
