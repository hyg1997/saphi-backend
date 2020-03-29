const _ = require('lodash');

const { User } = require('./userModel');
const { setResponse } = require('../../utils');

const listUser = async reqQuery => {
  const users = await User.find();
  return setResponse(200, 'Users found.', users);
};

const readUser = async reqParams => {
  const user = await User.findById(reqParams.id);
  if (!user) return setResponse(404, 'User not found.');

  return setResponse(200, 'User found.', user);
};

const readUserByFieldIds = async reqBody => {
  const user = await User.findByIds(reqBody);
  if (!user) return setResponse(404, 'User not found.');

  return setResponse(200, 'User found.', user);
};

const createUser = async reqBody => {
  let user = await User.findByIds(reqBody);
  if (user) return setResponse(400, 'User already exists.');

  user = new User(reqBody);
  await user.save();

  user = await User.findById(user.id, { password: 0 });

  return setResponse(201, 'User created.', user);
};

module.exports = {
  listUser,
  readUser,
  readUserByFieldIds,
  createUser,
};
