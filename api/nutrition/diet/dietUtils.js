/* eslint-disable no-param-reassign */
const _ = require('lodash');
const moment = require('moment');
const { Diet } = require('./dietModel');
const { setMeals } = require('./dietService');
const {
  MEAL_NAME,
  MACROCONTENT_CAL,
  FAT_LIMIT,
  MACRO_ERROR_LIMIT,
  DIET_FACTORS,
  getDictValues,
} = require('../../utils/constants');

const macroError = macroContent => {
  //* Metric to minimize calories error
  return (
    MACROCONTENT_CAL.protein * Math.abs(macroContent.protein) +
    MACROCONTENT_CAL.fat * Math.abs(macroContent.fat) +
    MACROCONTENT_CAL.carbohydrate * Math.abs(macroContent.carbohydrate)
  );
};

const calcInitQuantity = (macroContent, aliment) => {
  //* Quantity of aliment to start close to macronutrient value
  let maxMacro = '';
  let quantity = 0;

  Object.keys(aliment.macroContent).forEach(macro => {
    if (
      !maxMacro ||
      (aliment.macroContent[macro] > 0 &&
        aliment.macroContent[maxMacro] <= aliment.macroContent[macro])
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

const calcRestMacro = (macroContent, aliments) => {
  //* Calculate deficit on macroContent
  //* after consider the list of aliments each one with their quantities

  const rest = { ...macroContent };
  aliments.forEach(aliment => {
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

const adjustOneAliment = (aliments, macroContent) => {
  //* Step to improve solution
  //* Changing quantity of the aliment of the macronutrient with the greatest difference

  const macroOrdered = Object.keys(macroContent).sort((a, b) => {
    return Math.abs(macroContent[b]) - Math.abs(macroContent[a]);
  });

  for (let i = 0; i < macroOrdered.length; i += 1) {
    const refMacro = macroOrdered[i];
    let change = false;
    //* Is considered there is at most one of each type
    aliments.forEach(function(aliment) {
      if (
        Object.keys(aliment.macroContent).every(
          val => aliment.macroContent[refMacro] >= aliment.macroContent[val],
        )
      ) {
        if (macroContent[refMacro] > 0) {
          aliment.quantity += aliment.minQuantity;
          change = true;
        } else if (aliment.quantity > aliment.minQuantity) {
          aliment.quantity -= aliment.minQuantity;
          change = true;
        }
      }
    });
    if (change) break;
  }

  return aliments;
};

const adjustMeal = (meal, contentRef, macroContent) => {
  // ? meal => Comidas
  // ? contentRef => Objetivo de macros
  // ? macroContent => Total de macros
  //* Calculate quantities on aliments meal
  //* based on getting close to contentRef
  const newMeal = { ...meal };
  let { aliments } = meal;

  if (aliments.length === 1) {
    //* After or Before Lunch case
    const aliment = newMeal.aliments[0];
    aliment.quantity = calcInitQuantity(contentRef, aliment);

    const newRestMacroContent = calcRestMacro(macroContent, [aliment]);
    return { newRestMacroContent, newMeal };
  }

  aliments = aliments.map(function(aliment) {
    const quantity = calcInitQuantity(contentRef, aliment);
    return { ...aliment, quantity };
  });

  const actRest = calcRestMacro(contentRef, aliments);
  let actError = macroError(actRest);
  while (true) {
    //* Little change on quantities for aliments
    let newAliments = aliments.map(function(item) {
      return { ...item };
    });

    newAliments = adjustOneAliment(newAliments, actRest);

    const newRest = calcRestMacro(contentRef, newAliments);
    const newError = macroError(newRest);
    if (actError > newError) {
      aliments = newAliments;
      actError = newError;
    } else {
      break;
    }
  }

  const newRestMacroContent = calcRestMacro(macroContent, aliments);
  newMeal.aliments = aliments;
  return { newRestMacroContent, newMeal };
};

// TODO: A cambiar con nuevas combinaciones
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

const allowFat = (mealName, aliments, macroContent, meals) => {
  let restMacroContent = { ...macroContent };
  meals.forEach(meal => {
    if (meal.name !== mealName)
      restMacroContent = calcRestMacro(restMacroContent, meal.aliments);
  });

  const { newRestMacroContent } = adjustMeal(
    { aliments },
    restMacroContent,
    restMacroContent,
  );

  return (
    newRestMacroContent.fat > FAT_LIMIT ||
    macroError(newRestMacroContent) > MACRO_ERROR_LIMIT
  );
};

const calcFormatDiet = diet => {
  //* Add quantities on each aliment based on list of aliments
  //* and the rules of mealReference
  // ! Sugerencia
  // ! 1. funcion que primero haga la separacion de
  // !    las macros del dia segun los meals del usuario
  // ! 2. Para cada meal, con los macros separados que se obtuvo
  // !    del caso anterior, devolver las cantidades de cada alimento
  // !    Dentro de esta segundo funcion se realizaria las operaciones
  // !    necesarias para calcular las cantidades correctas

  // ? If every meal is processed indepently first
  // ? it would make the adjustment process more complicated
  // ? How do we know which aliment must be changed
  // ? to make a better aproximation to final content but also
  // ? minimizing error on the especific meal?

  const newDiet = { ...diet.toObject() };
  const meals = [];

  let restMacroContent = newDiet.macroContent;

  for (let i = 0; i < mealReference.length; i += 1) {
    const { mealName, content } = mealReference[i];
    const meal = diet.meals.find(item => item.name === mealName);

    if (meal) {
      let reference = { ...restMacroContent }; // ? Los macronutrientes

      if ('func' in content) {
        Object.keys(reference).forEach(key => {
          reference[key] = content.func(reference[key]);
        });
      } else {
        reference = { ...content };
      }

      const { newRestMacroContent, newMeal } = adjustMeal(
        meal.toObject(),
        reference,
        restMacroContent,
      );

      restMacroContent = newRestMacroContent;
      meals.push(newMeal);
    }
  }

  newDiet.meals = meals;
  return newDiet;
};

const calcDiet = userData => {
  const age = moment().diff(userData.birthDate, 'years');

  const { indicators } = userData;
  const plus = indicators.sex === 'F' ? -161 : 5;
  let calories =
    10 * indicators.weight + 6.25 * indicators.height - 5 * age + plus;

  // const exerciseFactor = { 0: 1.2, 1: 1.5, 2: 1.7, 3: 1.9 };
  calories *= DIET_FACTORS.exerciseFactor[indicators.idPhysicalActivity];

  // const objectiveFactor = { 0: 0.7, 1: 0.75, 2: 0.8, 3: 1.1 };
  calories *= DIET_FACTORS.objectiveFactor[indicators.idObjective];

  const weightMinusFat =
    indicators.weight * (1 - indicators.bodyFatPercentage / 100);
  let protein = 2.5 * weightMinusFat;

  // const fatFactor = { 0: 0.35, 1: 0.3, 2: 0.2, 3: 0 };
  let fat = (calories * DIET_FACTORS.fatFactor[indicators.idBodyFat].val) / 9;

  let carbohydrate = (calories - protein * 4 - fat * 9) / 4;

  carbohydrate = _.round(carbohydrate, 1);
  protein = _.round(protein, 1);
  fat = _.round(fat, 1);

  return { carbohydrate, protein, fat };
};

const createDiet = async user => {
  const userData = user.toObject();

  const { indicators } = userData;
  indicators.age = user.age;

  const macroContent = calcDiet(userData);

  // *Create Diet object
  const diet = new Diet({
    user: user.id,
    macroContent,
    meals: [],
    indicators,
  });
  await diet.save();

  // * Update user
  user.macroContent = macroContent;
  user.diet = diet.id;
  await user.save();

  const dataMeals = {};
  getDictValues(MEAL_NAME).forEach(val => {
    dataMeals[val] = true;
  });
  await setMeals(dataMeals, user);
};

module.exports = {
  calcFormatDiet,
  createDiet,
  calcDiet,
  allowFat,
};
