/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
const winston = require('winston');
const mongoose = require('mongoose');

require('../../../startup/config')();
require('../../../startup/logging')();

const config = require('config');
const { User } = require('../../../api/auth/user/userModel');
const {
  DeliveryOrder,
} = require('../../nutrition/deliveryOrder/deliveryOrderModel');
const { createDiet } = require('../../nutrition/diet/dietService');

const headers = {
  headers: {
    Authorization: `Bearer ${config.get('skCulqi')}`,
  },
};

const deleteUser = async id => {
  const respCulqi = await axios.delete(
    `https://api.culqi.com/v2/customers/${id}`,
    {},
    headers,
  );
  winston.info(`Customer ${id} deleted!`);
};

const cleanAllUsers = async () => {
  try {
    const respCulqi = await axios.get(
      'https://api.culqi.com/v2/customers/',
      {},
      headers,
    );
    console.log(respCulqi.data);
  } catch (error) {
    console.log(error.response.status);
    console.log(error.response.data);
  }
};

const testCreateDiet = async () => {
  const user = await User.findOne({ indicators: { $exists: true } });
  console.log(user.id);
  console.log(user);
  await createDiet(user);
  console.log(user.diet);
};

const testDelivery = async () => {
  const deliverys = await DeliveryOrder.aggregate([
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
    { $match: {} },
  ]).count('endDate');
  // .sort({ 'user_data.name': -1 })
  // .collation({ locale: 'es', strength: 1 })
  //  .skip(0)
  //  .limit(5);

  console.log(deliverys);
  // for (const del of deliverys) {
  //  console.log(del);
  // }
  // console.log(users);
};

mongoose
  .connect(config.get('dbConfig'), {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(testDelivery);
// .catch(err => console.log(`Failed to connect to MongoDB...${String(err)}`));
