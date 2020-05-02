/* eslint-disable no-param-reassign */
const {
  DeliveryOrder,
} = require('../../nutrition/deliveryOrder/deliveryOrderModel');
const { setResponse } = require('../../utils');

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
  listAdminDeliveryOrder,
  getDeliveryOrder,
  generateQueryDeliveryOrder,
};
