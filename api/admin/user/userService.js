/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
const config = require('config');

const { User } = require('../../auth/user/userModel');
const {
  DeliveryOrder,
} = require('../../nutrition/deliveryOrder/deliveryOrderModel');
const {
  CulqiPayment,
} = require('../../payment/culqiPayment/culqiPaymentModel');

const { setResponse, renderTemplate, sendEmail } = require('../../utils');

const generateQueryUsers = reqBody => {
  const allFields = ['name', 'lastName', 'email', 'companyName', 'id'];
  const matchFields = ['activeDiet', 'onboardingFinished'];
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

  return setResponse(200, 'Users found.', listUsers);
};

const getAdminUser = async userId => {
  const user = await User.findById(userId)
    .populate('pathologies')
    .populate('plan');

  const deliveryOrders = await DeliveryOrder.find({ user: user.id });
  const payments = await CulqiPayment.find({ user: user.id });
  return setResponse(200, 'User found.', { user, deliveryOrders, payments });
};

const setMacrosOnUser = async (userId, reqBody) => {
  const user = await User.findById(userId);
  if (!user.onboardingFinished)
    return setResponse(400, "User didn't finished onboarding", {});
  user.macroContent = {
    carbohydrate: reqBody.carbohydrate,
    protein: reqBody.protein,
    fat: reqBody.fat,
  };
  user.specialDiet = true;
  user.activeDiet = true;
  await user.save();

  const domain = config.get('hostname');
  const content = await renderTemplate('email_new_diet.html', {
    domain,
    message: reqBody.message,
  });

  try {
    await sendEmail(content, user.email, 'Tu Nuevo Plan Nutricional');
  } catch (error) {
    return setResponse(503, 'Ocurrio un error', {});
  }

  return setResponse(200, 'Updated User', {});
};

module.exports = {
  generateQueryUsers,
  listAdminUsers,
  getAdminUser,
  setMacrosOnUser,
};
