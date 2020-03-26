/* eslint-disable no-param-reassign */

const { Diet } = require('./dietModel');
const { Aliment } = require('../aliment/alimentModel');
const { setResponse } = require('../../utils');
const {
  MEAL_NAME,
  ALIMENT_TYPE,
  ALIMENT_TAG_TITLE,
} = require('../../utils/constants');

const calcRestMacro = (macroContent, aliments) => {
  const rest = { ...macroContent };
  aliments.forEach(function(aliment) {
    aliment.finalMacroContent = {
      protein:
        (aliment.macroContent.protein * aliment.quantity) / aliment.minQuantity,
      carbohydrate:
        (aliment.macroContent.carbohydrate * aliment.quantity) /
        aliment.minQuantity,
      fat: (aliment.macroContent.fat * aliment.quantity) / aliment.minQuantity,
    };

    rest.protein -= aliment.finalMacroContent.protein;
    rest.carbohydrate -= aliment.finalMacroContent.carbohydrate;
    rest.fat -= aliment.finalMacroContent.fat;
  });

  return rest;
};

const calcInitQuantity = (macroContent, aliment) => {
  const macroList = ['carbohydrate', 'protein', 'fat'];
  let maxMacro = macroList[0];
  let quantity = 0;
  macroList.forEach(function(macro) {
    if (
      aliment.macroContent[macro] > 0 &&
      aliment.macroContent[maxMacro] <= aliment.macroContent[macro]
    ) {
      //* Find principal macronutrient
      quantity =
        Math.round(macroContent[macro] / aliment.macroContent[macro]) *
        aliment.minQuantity;
      maxMacro = macro;
    }
  });
  return quantity;
};

const adjustOneAliment = (aliments, macroContent) => {
  const macroList = ['carbohydrate', 'protein', 'fat'];
  let refMacro = macroList[0];
  macroList.forEach(function(macro) {
    if (Math.abs(macroContent[macro]) > Math.abs(macroContent[refMacro])) {
      refMacro = macro;
    }
  });

  // * Consider ther is at most one of each type
  aliments.forEach(function(aliment) {
    if (
      macroList.every(
        val => aliment.macroContent[refMacro] >= aliment.macroContent[val],
      )
    ) {
      if (macroContent[refMacro] > 0) {
        aliment.quantity += aliment.minQuantity;
      } else if (aliment.quantity > 0.5) {
        aliment.quantity -= aliment.minQuantity;
      }
    }
  });

  return aliments;
};

const macroError = macroContent => {
  return (
    4 * Math.abs(macroContent.protein) +
    9 * Math.abs(macroContent.fat) +
    4 * Math.abs(macroContent.carbohydrate)
  );
};

const adjustMeal = (meal, contentRef, macroContent) => {
  const newMeal = { ...meal.toObject() };
  let { aliments } = meal;

  if (aliments.length === 1) {
    //* After or Before Lunch case
    const aliment = newMeal.aliments[0];
    aliment.quantity = calcInitQuantity(contentRef, aliment);

    const newRest = calcRestMacro(macroContent, [aliment]);
    return { newRest, newMeal };
  }

  aliments = aliments.map(function(aliment) {
    const quantity = calcInitQuantity(contentRef, aliment);
    return { ...aliment, quantity };
  });

  while (true) {
    const actRest = calcRestMacro(contentRef, aliments);

    let newAliments = aliments.map(function(item) {
      return { ...item };
    });

    newAliments = adjustOneAliment(newAliments, actRest);

    const newRest = calcRestMacro(contentRef, newAliments);
    // console.log(aliments, newAliments);
    // console.log(actRest, newRest);
    if (macroError(actRest) > macroError(newRest)) {
      aliments = newAliments;
    } else {
      break;
    }
  }

  const newRest = calcRestMacro(macroContent, aliments);
  newMeal.aliments = aliments;
  return { newRest, newMeal };
};

const calcFormatDiet = diet => {
  const newDiet = { ...diet.toObject() };
  const meals = [];
  let rest = diet.macroContent;

  const mealReference = [
    {
      mealName: MEAL_NAME.breakfast,
      content: { protein: 30, carbohydrate: 40, fat: 15 },
    },
    {
      mealName: MEAL_NAME.beforeLunch,
      content: { protein: 20, carbohydrate: 20, fat: 10 },
    },
    {
      mealName: MEAL_NAME.afterLunch,
      content: { protein: 20, carbohydrate: 20, fat: 10 },
    },
    { mealName: MEAL_NAME.lunch, content: { func: val => val / 2 } },
    { mealName: MEAL_NAME.dinner, content: { func: val => val } },
  ];

  for (let i = 0; i < 5; i += 1) {
    const { mealName, content } = mealReference[i];
    const meal = diet.meals.find(item => item.name === mealName);

    if (meal) {
      let reference = { ...rest };
      if ('func' in content) {
        Object.keys(reference).forEach(function(key) {
          reference[key] = content.func(reference[key]);
        });
      } else {
        reference = { ...content };
      }

      const { newRest, newMeal } = adjustMeal(meal, reference, rest);
      rest = newRest;
      meals.push(newMeal);
    }
  }
  // console.log('Error', rest);
  newDiet.meals = meals;
  return newDiet;
};

const setMeals = async (reqBody, reqUser) => {
  const diet = await Diet.findOne({ user: reqUser.id });

  if (
    ['desayuno', 'almuerzo', 'cena'].some(function(mealName) {
      return !(mealName in reqBody && reqBody[mealName]);
    })
  ) {
    return setResponse(
      400,
      'Desayuno, Almuerzo y Cena deben estar seleccionados',
      {},
    );
  }

  let tmpAliments = [];
  // TODO: Depends on the seed
  tmpAliments = [
    'Pechuga de pollo sin piel',
    'Arroz blanco',
    'Aceite de oliva extra virgen',
  ].map(async function(name) {
    const aliment = await Aliment.findOne({ name });
    const data = { ...aliment.toObject(), aliment: aliment.id };
    return data;
  });
  tmpAliments = await Promise.all(tmpAliments);

  const lunch = { name: MEAL_NAME.lunch, aliments: tmpAliments };
  const dinner = { name: MEAL_NAME.dinner, aliments: tmpAliments };

  tmpAliments = ['Pechuga de pollo sin piel', 'Pan de molde', 'Linaza'].map(
    async function(name) {
      const aliment = await Aliment.findOne({ name });
      const data = { ...aliment.toObject(), aliment: aliment.id };
      return data;
    },
  );
  tmpAliments = await Promise.all(tmpAliments);
  const breakfast = { name: MEAL_NAME.breakfast, aliments: tmpAliments };

  tmpAliments = ['Manzana verde'].map(async function(name) {
    const aliment = await Aliment.findOne({ name });
    const data = { ...aliment.toObject(), aliment: aliment.id };
    return data;
  });
  tmpAliments = await Promise.all(tmpAliments);
  const beforeLunch = { name: MEAL_NAME.beforeLunch, aliments: tmpAliments };
  const afterLunch = { name: MEAL_NAME.afterLunch, aliments: tmpAliments };

  const meals = [breakfast, lunch, dinner]; // Init with base meals

  if (MEAL_NAME.beforeLunch in reqBody && reqBody[MEAL_NAME.beforeLunch]) {
    meals.push(beforeLunch);
  }
  if (MEAL_NAME.afterLunch in reqBody && reqBody[MEAL_NAME.afterLunch]) {
    meals.push(afterLunch);
  }

  diet.meals = meals;
  const auxDiet = calcFormatDiet(diet);
  diet.meals = auxDiet.meals;

  await diet.save();

  return setResponse(200, 'Diet updated.', diet);
};

const getDiet = async reqUser => {
  let diet = await Diet.findOne({ user: reqUser.id });

  if (diet == null) {
    /*
    await Diet.deleteMany({});
    await Diet.create({
      user: reqUser.id,
      macroContent: {
        protein: 160,
        carbohydrate: 169,
        fat: 37,
      },
      meals: [],
    });

    const dataMeals = {};
    getDictValues(MEAL_NAME).forEach(val => {
      dataMeals[val] = true;
    });
    const response = setMeals(dataMeals, reqUser);
    return response; */
    return setResponse(
      404,
      'No Diet',
      {},
      'Pronto tendrás una dieta asignada.',
    );
  }

  diet = calcFormatDiet(diet);
  return setResponse(200, 'Diet found.', diet);
};

const changeAliment = async (reqBody, reqQuery, reqUser) => {
  const { macroStep, past } = reqBody;

  const { meal } = reqQuery;
  console.log(meal);
  // console.log(meal);
  const stepList = ['init', 'protein', 'carbohydrate', 'fat', 'end'];

  //* Save Meal
  if (macroStep === 'fat' || macroStep === 'all') {
    const diet = await Diet.findOne({ user: reqUser.id });
    let { meals } = diet;
    let aliments = past.map(async function(item) {
      let aliment = await Aliment.findById(item.alimentId);
      aliment = aliment.toObject();
      aliment.aliment = item.alimentId;
      return aliment;
    });
    aliments = await Promise.all(aliments);
    const mealData = { name: meal, aliments };
    meals = meals.map(function(item) {
      return item.name === meal ? mealData : item;
    });

    diet.meals = meals;
    const auxDiet = calcFormatDiet(diet);
    diet.meals = auxDiet.meals;
    await diet.save();

    return setResponse(200, 'Diet updated.', {
      nextStep: 'end',
      allow: true,
    });
  }

  const pos = stepList.findIndex(val => val === macroStep);

  let nextStep = stepList[pos + 1];
  let typeAllow = [nextStep];

  if (
    meal === MEAL_NAME.beforeLunch.toLowerCase() ||
    meal === MEAL_NAME.afterLunch.toLowerCase()
  ) {
    nextStep = 'all';
    typeAllow = ['protein', 'carbohydrate', 'fat'];
  }
  const title = ALIMENT_TAG_TITLE[nextStep];
  typeAllow = typeAllow.map(val => ALIMENT_TYPE[val]);

  const aliments = await Aliment.find({
    $and: [
      { type: { $in: typeAllow } },
      { meals: { $elemMatch: { name: meal, active: true } } },
    ],
  });

  const data = {
    nextStep,
    title,
    allow: true,
    aliments,
  };
  return setResponse(200, 'Aliments founds.', data);
};

const getAliment = async (reqParams, reqUser) => {
  let diet = await Diet.findOne({ user: reqUser.id });
  if (diet == null) {
    return setResponse(404, 'No Diet found.', {});
  }
  diet = diet.toObject();

  const { meals } = diet;
  const meal = meals.find(val => val.name === reqParams.meal);
  if (meal == null) {
    return setResponse(404, 'No Meal found.', {});
  }

  const { aliments } = meal;
  // eslint-disable-next-line eqeqeq
  const aliment = aliments.find(a => a.aliment == reqParams.aliment);
  if (aliment == null) {
    return setResponse(404, 'No Aliment found.', {});
  }

  aliment.finalMacroContent = {
    protein: (aliment.macroContent.protein * aliment.quantity).toFixed(2),
    carbohydrate: (
      aliment.macroContent.carbohydrate * aliment.quantity
    ).toFixed(2),
    fat: (aliment.macroContent.fat * aliment.quantity).toFixed(2),
  };

  return setResponse(200, 'Aliment found.', aliment);
};

const calcDiet = async userData => {
  // TODO: Calc age
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
  setMeals,
  changeAliment,
  getAliment,
};
