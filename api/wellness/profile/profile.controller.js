const Service = require('./profile.service');
const ChapterService = require('../chapter/chapter.service');

const getProfileUser = async (req, res) => {
  let response = await Service.getProfile({ user: req.user.id });
  if (response.status === 200)
    return res.status(response.status).send(response);

  const { data: modules } = await ChapterService.getInitModules(req.user);

  response = await Service.createBaseProfile(req.user, modules);
  return res.status(200).send(response);
};

const updateProfileActivityStatus = async (req, res) => {
  const profile = await Service.getProfile({ user: req.user.id });

  if (profile.status !== 200) return res.status(profile.status).send(profile);

  const response = await Service.updateActivityStatus(
    req.body,
    req.user,
    profile.data,
  );
  return res.status(response.status).send(response);
};

module.exports = {
  getProfileUser,
  updateProfileActivityStatus,
};
