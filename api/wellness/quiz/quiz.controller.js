const Service = require('./quiz.service');

const getQuiz = async (req, res) => {
  const response = await Service.getQuiz(req.params);
  return res.status(response.status).send(response);
};

module.exports = {
  getQuiz,
};
