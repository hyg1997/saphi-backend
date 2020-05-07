const Service = require('./quizAnswer.service');

const postQuizAnswer = async (req, res) => {
  const response = await Service.postQuizAnswer(req.params, req.body, req.user);
  // TODO: Actualizar myMentalHealthObject
  return res.status(response.status).send(response);
};

module.exports = {
  postQuizAnswer,
};
