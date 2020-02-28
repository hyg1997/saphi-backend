const mongoose = require('mongoose');

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
    enum: ['lunch', 'dinner'],
    default: 'lunch',
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
