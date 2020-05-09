/* eslint-disable global-require */
module.exports = {
  // TODO: Refactor code to use ...
  getDiet: require('./getDiet'),
  getAlimentDiet: require('./getAlimentDiet'),
  setMeals: require('./setMeals'),
  changeAliment: require('./changeAliment'),
  createDiet: require('./createDiet'),
  ...require('./listDiet'),
};
