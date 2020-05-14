/* eslint-disable no-param-reassign */
const { Profile } = require('./profile.model');
const { User } = require('../../auth/user/userModel');
const { setResponse } = require('../../utils');
const { PROGESS_STATUS } = require('../../utils/constants');

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

  // ? Save wellnessProfile in user
  await User.findByIdAndUpdate(reqUser.id, { wellnessProfile: profile.id });

  return setResponse(201, 'Profile created', profile);
};

const updateActivityStatus = async (reqBody, reqUser, profile) => {
  const modIndex = profile.modules.findIndex(obj =>
    obj.module.equals(reqBody.moduleId),
  );
  if (modIndex === -1)
    return setResponse(404, 'Module not found in user profile');

  const module = profile.modules[modIndex];

  const chaIndex = module.chapters.findIndex(obj =>
    obj.chapter.equals(reqBody.chapterId),
  );
  if (chaIndex === -1)
    return setResponse(404, 'Chapter not found in user profile');

  const chapter = module.chapters[chaIndex];

  const actIndex = chapter.activities.findIndex(obj =>
    obj.activity.equals(reqBody.activityId),
  );
  if (actIndex === -1)
    return setResponse(404, 'Activity not found in user profile');

  const activity = chapter.activities[actIndex];

  // ? Update status
  if (activity.status === PROGESS_STATUS.completed)
    return setResponse(400, 'Activity already completed');
  if (activity.status === PROGESS_STATUS.locked)
    return setResponse(400, 'Activity is locked and can not be completed');
  activity.status = reqBody.status;

  // ? If status is completed, record date of completion
  if (reqBody.status === PROGESS_STATUS.completed)
    activity.completionDate = new Date();

  // ? If next activity exists, make it available
  if (actIndex + 1 < chapter.activities.length) {
    const nextActivity = chapter.activities[actIndex + 1];
    nextActivity.status = PROGESS_STATUS.available;
  }

  await profile.save();

  return setResponse(200, 'Activity status updated', profile);
};

module.exports = {
  getProfile,
  createBaseProfile,
  updateActivityStatus,
};
