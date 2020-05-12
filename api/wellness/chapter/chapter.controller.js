const Service = require('./chapter.service');

const getChapter = async (req, res) => {
  const response = await Service.getChapter(req.params);
  return res.status(response.status).send(response);
};

const getChapterActivity = async (req, res) => {
  const response = await Service.getChapterActivity(req.params);
  return res.status(response.status).send(response);
};

const listChapterByModule = async (req, res) => {
  const response = await Service.listChapterByModule(req.query);
  return res.status(response.status).send(response);
};

module.exports = {
  getChapter,
  getChapterActivity,
  listChapterByModule,
};
