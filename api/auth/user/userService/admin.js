/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
const { User } = require('../userModel');
const {
  DeliveryOrder,
} = require('../../../nutrition/deliveryOrder/deliveryOrderModel');
const {
  CulqiPayment,
} = require('../../../payment/culqiPayment/culqiPaymentModel');

const { setResponse } = require('../../../utils');

const generateQueryUsers = reqBody => {
  const allFields = ['name', 'lastName', 'email', 'companyName'];
  const matchFields = ['activeDiet'];
  const query = [];

  if (reqBody.match) {
    if (!reqBody.match.every(obj => matchFields.includes(obj.field)))
      return setResponse(
        400,
        `Match fields are restricted to ${String(allFields)}`,
        {},
      );

    const allMatchs = reqBody.match.map(obj => {
      const matchItem = {};
      matchItem[obj.field] = obj.value;
      return matchItem;
    });

    query.push({ $match: { $and: allMatchs } });
  }

  if (reqBody.filter) {
    if (!reqBody.filter.every(obj => allFields.includes(obj.field)))
      return setResponse(
        400,
        `Filter fields are restricted to ${String(allFields)}`,
        {},
      );

    const allFilters = reqBody.filter.map(obj => {
      const filterItem = {};
      filterItem[obj.field] = { $regex: obj.value, $options: 'i' };
      return filterItem;
    });

    query.push({ $match: { $and: allFilters } });
  }

  if (reqBody.sort) {
    if (!reqBody.sort.every(obj => allFields.includes(obj.field)))
      return setResponse(
        400,
        `Sort fields are restricted to ${String(allFields)}`,
        {},
      );

    const allSorts = {};
    reqBody.sort.forEach(obj => {
      allSorts[`${obj.field}`] = obj.value === 'asc' ? 1 : -1;
    });
    query.push({ $sort: allSorts });
  }

  return setResponse(200, 'OK', query);
};

const listAdminUsers = async reqQueryMongoose => {
  let listUsers = [];
  try {
    listUsers = await User.aggregate([
      {
        $project: {
          idDocumentType: 1,
          idDocumentNumber: 1,
          phonePrefix: 1,
          phoneNumber: 1,
          name: 1,
          planSubscription: 1,
          lastName: 1,
          email: 1,
          companyName: 1,
          activeDiet: 1,
        },
      },
      ...reqQueryMongoose,
    ])
      .collation({ locale: 'es', strength: 1 })
      .exec();
  } catch (e) {
    return setResponse(500, 'Error', {});
  }

  return setResponse(200, 'Users found.', listUsers);
};

const getAdminUser = async id => {
  const user = await User.findById(id);
  const deliveryOrders = await DeliveryOrder.find({ user: user.id });
  const payments = await CulqiPayment.find({ user: user.id });
  return setResponse(200, 'User found.', { user, deliveryOrders, payments });
};

module.exports = {
  generateQueryUsers,
  listAdminUsers,
  getAdminUser,
};
