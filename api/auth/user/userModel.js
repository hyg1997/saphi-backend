const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');
const _ = require('lodash');
const bcrypt = require('bcrypt');

const { DOCUMENT_TYPE } = require('../../utils/constants');

const { Schema } = mongoose;
const userSchema = new Schema(
  {
    idDocumentType: {
      type: String,
      enum: [DOCUMENT_TYPE.DNI, DOCUMENT_TYPE.CE, DOCUMENT_TYPE.PASSPORT],
    },
    idDocumentNumber: { type: String },
    email: { type: String, required: true, unique: true },
    googleId: { type: String },
    facebookId: { type: String },
    password: { type: String },
    permissions: {
      type: {
        isAdmin: { type: Boolean, default: false },
        isPatient: { type: Boolean, default: true },
        isCompany: { type: Boolean, default: false },
      },
      default: {
        isAdmin: false,
        isPatient: true,
        isCompany: false,
      },
    },
    name: { type: String },
    lastName: { type: String },
    birthDate: { type: Date },
    phonePrefix: { type: String },
    phoneNumber: { type: String },
    companyName: { type: String },
    companyId: { type: mongoose.Schema.Types.ObjectId },

    endDate: { type: Date },

    planSubscription: {
      active: { type: Boolean, default: false },
      type: { type: String },
      startDate: { type: Date },
      endDate: { type: Date },
    },

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
        idObjective: { type: String },
        sex: { type: String },
        weight: { type: Number },
        height: { type: Number },
        idBodyFat: { type: String },
        bodyFatPercentage: { type: Number },
        idPhysicalActivity: { type: String },
      },
    },
    pathologies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Pathology' }],
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
    specialDiet: { type: Boolean, default: false },

    actionCode: {
      type: {
        code: { type: String },
        expires: { type: Date },
      },
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', async function(next) {
  if (!this.password) next();
  const salt = await bcrypt.genSalt(config.get('saltPow'));
  const hash = await bcrypt.hash(this.password, salt);
  this.password = hash;
  next();
});

userSchema.methods.isValidPassword = async function(password) {
  if (!this.password || !password) return false;
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
    ['googleId'],
    ['facebookId'],
  ];

  return this.findOne({
    $or: idIdentifiers
      .filter(fields => _.every(fields, _.partial(_.has, ids)))
      .map(fields => _.pick(ids, fields)),
  });
};

const User = mongoose.model('User', userSchema);

const UserLog = mongoose.model(
  'UserLog',
  new Schema(
    {
      user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User',
      },
      type: {
        type: String,
      },
      metadata: {
        type: Schema.Types.Mixed,
      },
    },
    { timestamps: true },
  ),
);

module.exports = {
  userSchema,
  User,
  UserLog,
};
