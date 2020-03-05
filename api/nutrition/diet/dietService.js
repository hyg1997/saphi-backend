const { Diet } = require('./dietModel');
const { setResponse } = require('../../utils');

const getDiet = async reqParams => {
  const diet = await Diet.findOne({ user: reqParams.id });
  return setResponse(200, 'Diet found.', diet);
};

const calcDiet = async userData => {
  // calc age
  const age = 0;
  const plus = userData.sex === 'F' ? -161 : 5;
  let calories = 10 * userData.weight + 6.25 * userData.height - 5 * age + plus;

  const exerciseFactor = { 0: 1.2, 1: 1.5, 2: 1.7, 3: 1.9 };
  calories *= exerciseFactor[userData.exerciseLevel];

  const objectiveFactor = { 0: 0.7, 1: 0.75, 2: 0.8, 3: 1.1 };
  calories *= objectiveFactor[userData.objectiveLevel];

  const weightMinusFat = userData.weight * (1 - userData.percFat);
  const protein = 2.5 * weightMinusFat;

  const fatFactor = { 0: 0.35, 1: 0.3, 2: 0.2, 3: 0 };
  const fat = (calories * fatFactor[userData.fatLevel]) / 9;

  const carbohydrate = (calories - protein * 4 - fat * 9) / 4;

  return { carbohydrate, protein, fat };
};

module.exports = {
  getDiet,
  calcDiet,
};
