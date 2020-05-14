const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');
const _ = require('lodash');
const bcrypt = require('bcrypt');

const { DOCUMENT_TYPE, getDictValues } = require('../../utils/constants');

const JWT_FIELDS = [
  // ? Identificadores
  '_id',
  'idDocumentType',
  'idDocumentNumber',
  'email',
  'googleId',
  'facebookId',
  // ? Informacion general
  'name',
  'lastName',
  'birthDate',
  'photo',
  'permissions',
  // ? bools
  'onboardingFinished',
  'activeDiet',
  'specialDiet',
  'hasPassword',
];

const { Schema } = mongoose;
const userSchema = new Schema(
  {
    // ? Identification properties
    idDocumentType: {
      type: String,
      enum: getDictValues(DOCUMENT_TYPE),
    },
    idDocumentNumber: { type: String },
    email: { type: String, required: true, unique: true },
    googleId: { type: String },
    facebookId: { type: String },
    password: { type: String },

    actionCode: {
      // ? Codigo para renovacion de contraseña
      type: {
        code: { type: String },
        expires: { type: Date },
      },
    },

    // ? General properties
    name: { type: String },
    lastName: { type: String },
    birthDate: { type: Date },
    phonePrefix: { type: String },
    phoneNumber: { type: String },
    companyName: { type: String },
    photo: {
      type: String,
      default: 'https://saphi.s3.amazonaws.com/user-profile/defaultProfile.png',
    },

    // ? properties
    onboardingFinished: { type: Boolean, default: false }, // ? Indica si se ha completado el onboarding
    activeDiet: { type: Boolean, default: false }, // ? Indica si existe una dieta activa
    specialDiet: { type: Boolean, default: false }, // ? Indica que tiene una dieta asignada manualmente
    hasPassword: { type: Boolean, default: false }, // ? Indica si usuario tiene seteada una contraseña
    hasCompanyRegistration: { type: Boolean, default: false }, // ? Indica si usuario ha sido creado como parte de una compañia
    wellnessOnboardingFinished: { type: Boolean, default: false }, // ? Indica si usuario ha completado el onboarding, se marca al crear el test de rueda de la vida

    // ? Notification properties
    notifications: {
      type: {
        payment: { type: Boolean, default: true },
        advertising: { type: Boolean, default: true },
        appUpdate: { type: Boolean, default: true },
      },
      default: {
        payment: true,
        advertising: true,
        appUpdate: true,
      },
    },

    // ? Business properties
    companyId: { type: mongoose.Schema.Types.ObjectId },

    // ? Role properties
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

    // ? Nutrition properties
    diet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Diet',
    },
    macroContent: {
      type: {
        carbohydrate: { type: Number },
        protein: { type: Number },
        fat: { type: Number },
      },
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

    // ? Wellness properties
    wellnessProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Profile',
    },

    // ? Subscription properties
    planSubscription: {
      active: { type: Boolean, default: false },
      type: { type: String },
      startDate: { type: Date },
      endDate: { type: Date },
    },
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Plan',
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', async function(next, currentUser, callback) {
  if (!this.isNew) return next();
  if (this.password) {
    this.password = await this.constructor.hashPassword(this.password);
    this.hasPassword = true;
  }
  next();
});

userSchema.statics.hashPassword = async password => {
  const salt = await bcrypt.genSalt(config.get('saltPow'));
  const hash = await bcrypt.hash(password, salt);
  return hash;
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

userSchema.methods.isValidPassword = async function(password) {
  if (!this.password || !password) return false;
  const compare = await bcrypt.compare(password, this.password);
  return compare;
};

userSchema.methods.getAvoidedAliments = function() {
  const protein = _.get(this, 'avoidedAliments.protein', []);
  const carbohydrate = _.get(this, 'avoidedAliments.fat', []);
  const fat = _.get(this, 'avoidedAliments.carbohydrate', []);

  return protein.concat(carbohydrate, fat);
};

userSchema.methods.generateAuthToken = function() {
  const payload = _.pick(this.toObject(), JWT_FIELDS);
  return jwt.sign(payload, config.get('jwtSecret'));
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
