const mongoose = require('mongoose');

const { MENU_TYPE } = require('../../utils/constants');

const menuSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    minlength: 1,
    maxlength: 255,
  },
  type: {
    type: String,
    require: true,
    enum: [MENU_TYPE.lunch, MENU_TYPE.dinner],
  },
  date: {
    type: Date,
    required: true,
  },
});

const Menu = mongoose.model('Menu', menuSchema);

module.exports = {
  menuSchema,
  Menu,
};
