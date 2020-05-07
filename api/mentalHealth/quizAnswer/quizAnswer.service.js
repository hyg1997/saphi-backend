/* eslint-disable no-param-reassign */
const { Quiz } = require('../quiz/quiz.model');
const { QuizAnswer } = require('./quizAnswer.model');
const { setResponse } = require('../../utils');

const postQuizAnswer = async (reqParams, reqBody, reqUser) => {
  const quiz = await Quiz.findOne(reqParams);
  if (!quiz) return setResponse(404, 'No quiz found');

  const quizAnswer = new QuizAnswer({
    user: reqUser.id,
    quiz: quiz.id,
    identifier: reqParams.identifier,
    ...reqBody,
  });

  await quizAnswer.save();

  return setResponse(200, 'QuizAnswer Created', quizAnswer);
};

module.exports = {
  postQuizAnswer,
};
