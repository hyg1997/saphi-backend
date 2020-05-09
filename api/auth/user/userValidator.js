/* eslint-disable consistent-return */
const multer = require('multer');
const path = require('path');
const { Joi } = require('celebrate');

const {
  emailValidator,
  passwordValidator,
} = require('../authentication/authenticationValidator');

const UpdateUser = {
  body: Joi.object()
    .keys({
      name: Joi.string()
        .min(1)
        .max(255),
      lastName: Joi.string()
        .min(1)
        .max(255),
      phonePrefix: Joi.string()
        .min(1)
        .max(255),
      phoneNumber: Joi.string()
        .min(1)
        .max(255),

      avoidedAliments: Joi.object({
        carbohydrate: Joi.array()
          .items(Joi.string())
          .required(),
        protein: Joi.array()
          .items(Joi.string())
          .required(),
        fat: Joi.array()
          .items(Joi.string())
          .required(),
      }),

      pastPassword: Joi.string()
        .trim()
        .min(6)
        .max(255),
      newPassword: Joi.string()
        .trim()
        .min(6)
        .max(255),
    })
    .without('avoidedAliments', [
      'name',
      'lastName',
      'phonePrefix',
      'phoneNumber',
      'pastPassword',
      'newPassword',
    ])
    .with('pastPassword', 'newPassword'),
};

const upload = multer({
  fileFilter(req, file, callback) {
    const ext = path.extname(file.originalname);
    if (!['.png', '.jpg', '.jpeg'].includes(ext)) {
      return callback(new Error('Only images are allowed'), false);
    }
    return callback(null, true);
  },
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  dest: '_tmp_/',
});

const validatePhoto = (req, res, next) => {
  upload.single('photo')(req, res, function(err) {
    if (err)
      return res
        .status('400')
        .send({ status: 400, message: String(err), data: {} });
    next();
  });
};

const ForgotPassword = {
  body: {
    ...emailValidator,
  },
};

const CheckCode = {
  body: {
    ...ForgotPassword.body,
    code: Joi.string()
      .trim()
      .min(4)
      .max(4)
      .required(),
  },
};

const ResetPassword = {
  body: {
    ...CheckCode.body,
    newPassword: passwordValidator.password,
  },
};

module.exports = {
  ForgotPassword,
  CheckCode,
  ResetPassword,
  UpdateUser,
  validatePhoto,
};
