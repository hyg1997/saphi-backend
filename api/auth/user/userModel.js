const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');
const _ = require('lodash');
const bcrypt = require('bcrypt');

const { Schema } = mongoose;
const userSchema = new Schema({
  idDocumentType: { type: String },
  idDocumentNumber: { type: String },
  email: { type: String, required: true },
  password: { type: String, required: true },
  permissions: {
    type: {
      isAdmin: { type: Boolean },
      isPatient: { type: Boolean },
      isCompany: { type: Boolean },
    },
  },
  name: { type: String },
  lastName: { type: String },
  birthDate: { type: Date },
  phonePrefix: { type: String },
  phoneNumber: { type: String },
  companyName: { type: String },
  macroContent: {
    type: {
      carbohydrate: { type: Number },
      protein: { type: Number },
      fat: { type: Number },
    },
  },
  indicators: {
    type: {
      objective: { type: String },
      sex: { type: String },
      weight: { type: Number },
      size: { type: Number },
      bodyFatPercentage: { type: Number },
      physicalActivity: { type: String },
      patologies: [{ type: String }],
    },
  },
  avoidedAliments: {
    type: [{ type: Schema.Types.Mixed }],
  },
});

userSchema.pre('save', async function(next) {
  const salt = await bcrypt.genSalt(config.get('saltPow'));
  const hash = await bcrypt.hash(this.password, salt);
  this.password = hash;
  next();
});

userSchema.methods.isValidPassword = async function(password) {
  const compare = await bcrypt.compare(password, this.password);
  return compare;
};

userSchema.methods.generateAuthToken = function() {
  const payload = _.omit(this.toObject(), ['password']);
  return jwt.sign(payload, config.get('jwtSecret'));
};

const User = mongoose.model('User', userSchema);

module.exports = {
  userSchema,
  User,
};
