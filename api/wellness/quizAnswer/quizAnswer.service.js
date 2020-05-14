/* eslint-disable no-param-reassign */
const { Quiz } = require('../quiz/quiz.model');
const { Profile } = require('../profile/profile.model');
const { QuizAnswer } = require('./quizAnswer.model');
const { setResponse } = require('../../utils');

const postQuizAnswer = async (reqParams, reqBody, reqUser) => {
  const quiz = await Quiz.findOne(reqParams);
  if (!quiz) return setResponse(404, 'No quiz found');

  const quizAnswer = await QuizAnswer.create({
    user: reqUser.id,
    quiz: quiz.id,
    identifier: reqParams.identifier,
    ...reqBody,
  });

  if (quiz.identifier === 'wheeloflife') {
    reqUser.wellnessOnboardingFinished = true;
    await Promise.all([
      reqUser.save(),
      Profile.findByUserIdAndUpdateWheel(reqUser.id, quizAnswer),
    ]);
  }
  return setResponse(200, 'QuizAnswer Created', quizAnswer);
};

module.exports = {
  postQuizAnswer,
};
