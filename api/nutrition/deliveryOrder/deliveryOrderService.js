const { DeliveryPlan } = require('./deliveryOrderModel');
const { setResponse } = require('../../utils');

const listDeliveryOrder = async user => {
  const deliveryOrders = await DeliveryPlan.find({ user: user.id });

  return setResponse(200, 'DeliveryOrders found.', deliveryOrders);
};

module.exports = {
  listDeliveryOrder,
};
