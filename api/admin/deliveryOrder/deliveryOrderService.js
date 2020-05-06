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

const countDeliveryOrder = async reqQuery => {
  const total = await DeliveryOrder.aggregate([
    {
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'user_data',
      },
    },
    { $unwind: { path: '$user_data', preserveNullAndEmptyArrays: true } },
    {
      $project: {
        startDate: 1,
        'user_data.name': 1,
        'user_data.lastName': 1,
        'user_data.email': 1,
      },
    },
    { $match: reqQuery.filter },
  ]).count('startDate');

  if (total.length === 0) return 0;
  return total[0].startDate;
};

const generateQueryDeliveryOrder = reqBody => {
  const filterFields = ['id', 'name', 'lastName', 'email'];
  const query = { filter: {}, sort: {} };

  if (reqBody.filter) {
    if (!reqBody.filter.every(obj => filterFields.includes(obj.field)))
      return setResponse(400, 'Fields error', {});

    const allFilters = reqBody.filter.map(obj => {
      const filterItem = {};
      filterItem[`user_data.${obj.field}`] = { $regex: obj.value };
      return filterItem;
    });
    query.filter.$and = allFilters;
  }

  if (reqBody.sort) {
    if (!reqBody.sort.every(obj => filterFields.includes(obj.field)))
      return setResponse(400, 'Fields error', {});

    const allSorts = {};
    reqBody.sort.forEach(obj => {
      allSorts[`user_data.${obj.field}`] = obj.value === 'asc' ? 1 : -1;
    });
    query.sort = allSorts;
  }

  return setResponse(200, 'OK', query);
};

const listAdminDeliveryOrder = async reqQuery => {
  const listDeliveryOrder = await DeliveryOrder.aggregate([
    {
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'user_data',
      },
    },
    { $unwind: { path: '$user_data', preserveNullAndEmptyArrays: true } },
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
    { $match: reqQuery.filter },
  ])
    .sort(reqQuery.sort)
    .collation({ locale: 'es', strength: 1 })
    .skip(reqQuery.skip)
    .limit(reqQuery.limit);

  return setResponse(200, 'DeliveryPlans found.', listDeliveryOrder);
};

module.exports = {
  countDeliveryOrder,
  listAdminDeliveryOrder,
  getDeliveryOrder,
  generateQueryDeliveryOrder,
};
