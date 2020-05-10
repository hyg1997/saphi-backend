/* eslint-disable no-param-reassign */
const { Profile } = require('./profile.model');
const { setResponse } = require('../../utils');

const getProfile = async reqParams => {
  const profile = await Profile.findOne(reqParams);
  if (!profile) return setResponse(404, 'Profile not found');
  return setResponse(200, 'Profile found', profile);
};

const createBaseProfile = async (reqUser, modules) => {
  let profile = await Profile.findOne({ user: reqUser.id });
  if (profile) return setResponse(400, 'Profile already exists');

  profile = await Profile.create({
    user: reqUser.id,
    wheelOfLife: {},
    modules,
  });

  return setResponse(201, 'Profile created', profile);
};

module.exports = {
  getProfile,
  createBaseProfile,
};
