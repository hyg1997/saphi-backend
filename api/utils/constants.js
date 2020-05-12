const config = require('config');

const USER_CONSTANTS = {
  DOCUMENT_TYPE: {
    DNI: 'DNI',
    CE: 'CE',
    PASSPORT: 'PASSPORT',
  },
};

module.exports = {
  PROGESS_STATUS: {
    locked: 'locked',
    available: 'available',
    completed: 'completed',
  },

  MENU_TYPE: {
    lunch: 'almuerzo',
    dinner: 'cena',
  },
  MEAL_NAME: {
    breakfast: 'desayuno',
    beforeLunch: 'media mañana',
    lunch: 'almuerzo',
    afterLunch: 'media tarde',
    dinner: 'cena',
  },
  DISH_RECIPE_TYPE: {
    sauce: 'salsa',
    dressing: 'aliño',
  },
  DELIVERY_ORDER_PLAN_TYPE: {
    lunch: 'almuerzo',
    complete: 'completo',
  },
  ALIMENT_TYPE: {
    carbohydrate: 'carbohidrato',
    protein: 'proteína',
    fat: 'grasa',
  },
  ALIMENT_TAG_TITLE: {
    carbohydrate: 'Carbohidratos',
    protein: 'Proteínas',
    fat: 'Grasas',
    all: 'Alimentos',
    fruit: 'Frutas',
    end: '',
  },
  MACROCONTENT_CAL: {
    carbohydrate: 4,
    protein: 4,
    fat: 9,
  },
  FAT_LIMIT: 1,
  MACRO_ERROR_LIMIT: 20,

  AVENA_SPECIAL_CASE: 'Avena de grano entero (40g) + fruta + canela',

  DIET_FACTORS: {
    exerciseFactor: { 0: 1.2, 1: 1.5, 2: 1.7, 3: 1.9 },
    objectiveFactor: { 0: 0.7, 1: 0.75, 2: 0.8, 3: 1.1 },
    fatFactor: {
      0: { val: 0.35, min: 0, max: 15, mean: 7.5 },
      1: { val: 0.3, min: 15, max: 20, mean: 17.5 },
      2: { val: 0.2, min: 20, max: 30, mean: 25 },
      3: { val: 0, min: 30, max: 100, mean: 35 },
    },
  },

  URL_CULQI: {
    userCreate: 'https://api.culqi.com/v2/customers',
    cardCreate: 'https://api.culqi.com/v2/cards',
    chargeCreate: 'https://api.culqi.com/v2/charges',
  },

  OTHER_PATHOLOGY: 'Otros',

  CONFIG_EMAIL: {
    service: 'gmail',
    auth: {
      user: config.get('emailSaphi'),
      pass: config.get('passwordEmailSaphi'),
    },
  },

  getDictValues: dict => {
    return Object.keys(dict).map(function(key) {
      return dict[key];
    });
  },
  ...USER_CONSTANTS,
};
