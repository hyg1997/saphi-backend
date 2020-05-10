/* eslint-disable no-param-reassign */
const { Quiz } = require('./quiz.model');
const { setResponse } = require('../../utils');

const getQuiz = async reqParams => {
  const quiz = await Quiz.findOne(reqParams);
  if (!quiz) return setResponse(404, 'No quiz found');
  return setResponse(200, 'Quiz Found', quiz);
};

module.exports = {
  getQuiz,
};
