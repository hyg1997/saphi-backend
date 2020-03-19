/* eslint-disable no-param-reassign */

const { Diet } = require('./dietModel');
const { Aliment } = require('../aliment/alimentModel');
const { setResponse } = require('../../utils');
const { MEAL_NAME } = require('../../utils/constants');

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
    if (macroList.every(val => aliment[refMacro] >= aliment[val])) {
      if (macroContent[refMacro] > 0) {
        aliment.quantity += aliment.minQuantity;
      } else if (aliment.quantity > 0) {
        aliment.quantity -= aliment.minQuantity;
      }
    }
  });
};

const macroError = macroContent => {
  return (
    Math.abs(macroContent.protein) +
    Math.abs(macroContent.fat) +
    Math.abs(macroContent.carbohydrate)
  );
};

const adjustMeal = (meal, contentRef, macroContent) => {
  const newMeal = { ...meal };
  let { aliments } = meal;

  if (aliments.length === 1) {
    //* After or Before Lunch case
    const aliment = newMeal.aliments[0];
    aliment.quantity = calcInitQuantity(contentRef, aliment);

    const newRest = calcRestMacro(macroContent, [aliment]);
    return { newRest, newMeal };
  }

  aliments = aliments.map(function(aliment) {
    aliment.quantity = calcInitQuantity(contentRef, aliment);
    return aliment;
  });

  while (true) {
    const actRest = calcRestMacro(contentRef, aliments);
    let newAliments = aliments.map(function(aliment) {
      return { ...aliment };
    });

    newAliments = adjustOneAliment(newAliments, actRest);

    const newRest = calcRestMacro(contentRef, newAliments);
    if (macroError(actRest) > macroError(newRest)) {
      aliments = newAliments;
    } else {
      break;
    }
  }

  newMeal.aliments = aliments;
  return newMeal;
};

const calcFormatDiet = diet => {
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
    { mealName: MEAL_NAME.dinner, content: { func: val => val / 2 } },
  ];

  for (let i = 0; i < 5; i += 1) {
    const { mealName, content } = mealReference[i];
    const meal = diet.meals.find(item => item.name === mealName);

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

  diet.meals = meals;
  return diet;
};

const getDiet = async reqUser => {
  let diet = await Diet.findOne({ user: reqUser.id });
  diet = calcFormatDiet(diet);
  return setResponse(200, 'Diet found.', diet);
};

const setMeals = async (reqBody, reqUser) => {
  let diet = await Diet.findOne({ user: reqUser.id });

  if (
    ['desayuno', 'almuerzo', 'cena'].some(function(mealName) {
      return mealName in reqBody;
    })
  ) {
    return setResponse(
      400,
      'Desayuno, Almuerzo y Cena deben estar seleccionados',
      {},
    );
  }

  const meals = []; // Init with base meals

  if (MEAL_NAME.beforeLunch in reqBody) {
    meals.push();
  }
  if (MEAL_NAME.afterLunch in reqBody) {
    meals.push();
  }

  diet.meals = meals;
  await Diet.updateOne({ _id: diet.id }, { $set: { meals } });

  diet = calcFormatDiet(diet);
  return setResponse(200, 'Diet updated.', diet);
};

const changeAliment = async (reqBody, reqQuery, reqUser) => {
  const { macroStep, past } = reqBody;
  const { meal } = reqQuery;
  // const alimentId = reqBody.selectedAlimentId;
  const stepList = ['init', 'protein', 'carbohydrate', 'fat', 'end'];

  //* Save Meal
  if (macroStep === 'fat' || macroStep === 'all') {
    const diet = await Diet.find({ user: reqUser.id });
    let { meals } = diet;
    const aliments = past.map(async function(item) {
      const aliment = await Aliment.findById(item.alimentId);
      aliment.aliment = aliment.id;
      return aliment;
    });
    const mealData = { name: meal, aliments };
    meals = meals.map(function(item) {
      return item.name === meal ? mealData : item;
    });

    await Diet.updateOne({ _id: diet.id }, { $set: { meals } });
  }

  const pos = stepList.findIndex(val => val === macroStep);
  let nextStep = macroStep[pos + 1];
  let typeAllow = [nextStep];

  if (meal === MEAL_NAME.beforeLunch || meal === MEAL_NAME.afterLunch) {
    nextStep = 'all';
    typeAllow = ['protein', 'carbohydrate', 'fat'];
  }

  const aliments = await Aliment.find({
    $and: [
      { type: { $in: typeAllow } },
      {
        meals: { $elementMatch: { $and: [{ name: meal }, { active: true }] } },
      },
    ],
  });

  const data = {
    nextStep,
    allow: true,
    aliments,
  };
  return setResponse(200, 'Aliments founds.', data);
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
};
