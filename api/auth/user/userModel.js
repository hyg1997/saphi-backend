const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');
const _ = require('lodash');
const bcrypt = require('bcrypt');

const { Schema } = mongoose;
const userSchema = new Schema(
  {
    idDocumentType: { type: String },
    idDocumentNumber: { type: String },
    email: { type: String, required: true },
    password: { type: String },
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

    endDate: { type: Date },

    macroContent: {
      type: {
        carbohydrate: { type: Number },
        protein: { type: Number },
        fat: { type: Number },
      },
    },

    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Plan',
    },
    indicators: {
      type: {
        idObjective: { type: Number },
        sex: { type: String },
        weight: { type: Number },
        heigth: { type: Number },
        idBodyFat: { type: Number },
        bodyFatPercentage: { type: Number },
        idPhysicalActivity: { type: Number },
      },
    },
    pathologies: [{ type: String }],
    otherPathology: { type: String, default: '' },
    avoidedAliments: {
      type: {
        carbohydrate: [{ type: String }],
        protein: [{ type: String }],
        fat: [{ type: String }],
      },
    },
    onboardingFinished: { type: Boolean, default: false },
    activeDiet: { type: Boolean, default: false },

    actionCode: {
      type: {
        code: { type: String },
        expires: { type: Date },
      },
    },
    oauth: {
      googleId: { type: String },
      facebookId: { type: String },
    },
  },
  {
    timestamps: true,
  },
);

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

userSchema.statics.findByIds = function(ids) {
  const idIdentifiers = [
    ['email'],
    ['idDocumentType', 'idDocumentNumber'],
    ['oauth.googleId'],
    ['oauth.facebookId'],
  ];
  return this.findOne({
    $or: idIdentifiers
      .filter(fields => _.has(ids, fields))
      .map(fields => _.pick(ids, fields)),
  });
};

const User = mongoose.model('User', userSchema);

module.exports = {
  userSchema,
  User,
};
