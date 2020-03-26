const Service = require('./dietService');

const getDiet = async (req, res) => {
  const diet = await Service.getDiet(req.user);

  return res.status(diet.status).send(diet);
};

const getAlimentDiet = async (req, res) => {
  const aliment = await Service.getAlimentDiet(req.params, req.user);

  return res.status(aliment.status).send(aliment);
};

const changeAliment = async (req, res) => {
  const response = await Service.changeAliment(req.body, req.params, req.user);

  return res.status(response.status).send(response);
};

const setMeals = async (req, res) => {
  const diet = await Service.setMeals(req.body, req.user);

  return res.status(diet.status).send(diet);
};

module.exports = {
  getDiet,
  getAlimentDiet,
  changeAliment,
  setMeals,
};
