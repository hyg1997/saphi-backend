const USER_CONSTANTS = {
  DOCUMENT_TYPE: {
    DNI: 'DNI',
    CE: 'CE',
    PASSPORT: 'PASSPORT',
  },
};

module.exports = {
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
    end: '',
  },
  MACROCONTENT_CAL: {
    carbohydrate: 4,
    protein: 4,
    fat: 9,
  },
  FAT_LIMIT: 1,
  MACRO_ERROR_LIMIT: 20,
  DIET_FACTORS: {
    exerciseFactor: { 0: 1.2, 1: 1.5, 2: 1.7, 3: 1.9 },
    objectiveFactor: { 0: 0.7, 1: 0.75, 2: 0.8, 3: 1.1 },
    fatFactor: { 0: 0.35, 1: 0.3, 2: 0.2, 3: 0 },
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
      user: 'abc@gmail.com',
      pass: '1234',
    },
  },

  getDictValues: dict => {
    return Object.keys(dict).map(function(key) {
      return dict[key];
    });
  },
  ...USER_CONSTANTS,
};
