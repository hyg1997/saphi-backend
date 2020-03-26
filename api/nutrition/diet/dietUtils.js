/* eslint-disable no-param-reassign */
const { MEAL_NAME } = require('../../utils/constants');

// ! Si es posible dejar un descripcion de que hacen estas funciones

const macroError = macroContent => {
  // ! Esos valores no deberían ser parte de una constante
  return (
    4 * Math.abs(macroContent.protein) +
    9 * Math.abs(macroContent.fat) +
    4 * Math.abs(macroContent.carbohydrate)
  );
};

const calcInitQuantity = (macroContent, aliment) => {
  // ! Deberían provenir de una constante
  const macroList = ['carbohydrate', 'protein', 'fat'];
  let maxMacro = macroList[0];
  let quantity = 0;

  // !? Como recomendacion usar fat arrows para funciones
  // ! El function solo es util cuando se quiere usar el "this"
  // ! (macro) => { ...contenido de la funcion }
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
  // ! Creo q la logica deberia modularizarse un poco mas
  // ! Sugerencia
  // ! 1. funcion que primero haga la separacion de
  // !    las macros del dia segun los meals del usuario
  // ! 2. Para cada meal, con los macros separados que se obtuvo
  // !    del caso anterior, devolver las cantidades de cada alimento
  // !    Dentro de esta segundo funcion se realizaria las operaciones
  // !    necesarias para calcular las cantidades correctas

  const newDiet = { ...diet.toObject() };
  const meals = [];
  // ! que representa la variable rest? Darle un nombre mas significativo tal vez
  let rest = diet.macroContent;

  // ! ¿Este objeto debería ser una constanto o un objeto global?
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
  calcFormatDiet,
  calcDiet,
};
