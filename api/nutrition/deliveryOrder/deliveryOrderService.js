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

const getDeliveryOrder = async reqParams => {
  const deliveryOrder = await DeliveryOrder.findById(reqParams.id).populate(
    'user',
  );

  return setResponse(200, 'DeliveryOrder found.', deliveryOrder);
};

const generateQueryDeliveryOrder = reqBody => {
  const filterFields = ['id', 'name', 'lastName', 'email', 'id'];
  const query = [];

  if (reqBody.filter) {
    if (!reqBody.filter.every(obj => filterFields.includes(obj.field)))
      return setResponse(400, 'Fields error', {});

    const allFilters = reqBody.filter.map(obj => {
      const filterItem = {};
      filterItem[`user_data.${obj.field}`] = { $regex: obj.value };
      return filterItem;
    });
    query.push({ $match: { $and: allFilters } });
  }

  if (reqBody.sort) {
    if (!reqBody.sort.every(obj => filterFields.includes(obj.field)))
      return setResponse(400, 'Fields error', {});

    const allSorts = {};
    reqBody.sort.forEach(obj => {
      allSorts[`user_data.${obj.field}`] = obj.value === 'asc' ? 1 : -1;
    });
    query.push({ $sort: allSorts });
  }

  return setResponse(200, 'OK', query);
};

const listAdminDeliveryOrder = async reqQueryMongoose => {
  let listDeliveryOrder = [];

  listDeliveryOrder = await DeliveryOrder.aggregate([
    {
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'user_data',
      },
    },
    {
      $project: {
        contactName: 1,
        contactPhone: 1,
        deliveryAddress: 1,
        startDate: 1,
        endDate: 1,
        deliveryPlan: 1,
        'culqiPayment.culqiInfo.id': 1,
        'user_data.name': 1,
        'user_data.lastName': 1,
        'user_data.email': 1,
      },
    },
    ...reqQueryMongoose,
  ]).exec();

  return setResponse(200, 'DeliveryPlans found.', listDeliveryOrder);
};

module.exports = {
  createDeliveryOrder,
  getUserDeliveryOrder,
  listAdminDeliveryOrder,
  getDeliveryOrder,
  // * Other
  validateDeliveryOrder,
  generateQueryDeliveryOrder,
};
