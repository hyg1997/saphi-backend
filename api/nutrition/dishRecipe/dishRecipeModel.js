const mongoose = require('mongoose');

const { Schema } = mongoose;
const dishRecipeSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['salsa', 'aliño'],
  },
  thumbnail: {
    type: String,
    required: true,
  },
  thumbnailImagePath: {
    type: String,
  },
  baseImagePath: {
    type: String,
  },
  detail: {
    difficulty: {
      type: String,
      required: true,
    },
    preparationTime: {
      type: String,
      required: true,
    },
    cookingTime: {
      type: String,
      required: true,
    },
    ingredients: [
      {
        quantity: { type: String, required: true },
        name: { type: String, required: true },
      },
    ],
    preparationDescription: {
      type: String,
      required: true,
    },
  },
});

const DishRecipe = mongoose.model('DishRecipe', dishRecipeSchema);

module.exports = {
  dishRecipeSchema,
  DishRecipe,
};
