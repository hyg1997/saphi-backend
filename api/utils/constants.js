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
  getDictValues: dict => {
    return Object.keys(dict).map(function(key) {
      return dict[key];
    });
  },
};
