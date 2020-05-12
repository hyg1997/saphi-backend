/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
const config = require('config');
const winston = require('winston');

const { User } = require('../../auth/user/userModel');
const { listDiets } = require('../../nutrition/diet/dietService');
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
  const query = { filter: { $and: [] }, sort: {} };

  if (reqBody.match) {
    if (!reqBody.match.every(obj => matchFields.includes(obj.field)))
      return setResponse(
        400,
        `Match fields are restricted to ${String(allFields)}`,
        {},
      );

    reqBody.match.forEach(obj => {
      const matchItem = {};
      matchItem[obj.field] = obj.value;

      query.filter.$and.push(matchItem);
    });
  }

  if (reqBody.filter) {
    if (!reqBody.filter.every(obj => allFields.includes(obj.field)))
      return setResponse(
        400,
        `Filter fields are restricted to ${String(allFields)}`,
        {},
      );

    reqBody.filter.forEach(obj => {
      const filterItem = {};
      filterItem[obj.field] = { $regex: obj.value, $options: 'i' };

      query.filter.$and.push(filterItem);
    });
  }

  if (query.filter.$and.length === 0) {
    delete query.filter.$and;
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
    query.sort = allSorts;
  }

  return setResponse(200, 'OK', query);
};

const listAdminUsers = async reqQuery => {
  const listUsers = await User.find(
    reqQuery.filter,
    'idDocumentType idDocumentNumber phonePrefix phoneNumber name planSubscription lastName email companyName activeDiet onboardingFinished',
  )
    .sort(reqQuery.sort)
    .collation({ locale: 'es', strength: 1 })
    .skip(reqQuery.skip)
    .limit(reqQuery.limit);

  return setResponse(200, 'Users found.', listUsers);
};

const getAdminUser = async userId => {
  const user = await User.findById(userId)
    .populate('pathologies')
    .populate('plan');

  const deliveryOrders = await DeliveryOrder.find({ user: user.id }).sort({
    createdAt: -1,
  });

  const payments = await CulqiPayment.find({ user: user.id }).sort({
    createdAt: -1,
  });

  const dietResp = await listDiets({ user: userId });
  const dietHistory = dietResp.status === 200 ? dietResp.data : [];

  return setResponse(200, 'User found.', {
    user,
    deliveryOrders,
    payments,
    dietHistory,
  });
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
    message: reqBody.message.split('\n'),
  });

  try {
    await sendEmail(content, user.email, 'Tu Nuevo Plan Nutricional');
  } catch (error) {
    winston.error(`Error al enviar correo de plan nutricional a ${user.email}`);
    // return setResponse(503, 'Ocurrio un error', {});
  }

  return setResponse(200, 'Updated User', {});
};

module.exports = {
  generateQueryUsers,
  listAdminUsers,
  getAdminUser,
  setMacrosOnUser,
};
