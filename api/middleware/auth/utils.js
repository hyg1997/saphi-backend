/* eslint-disable no-underscore-dangle */
const passport = require('passport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('config');

const { User } = require('../../auth/user/userModel');

const setup = () => {
  passport.serializeUser((user, done) => done(null, user._id));

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  });
};

const signToken = user => {
  return user.generateAuthToken();
};

const hashPassword = async password => {
  if (!password) {
    throw new Error('Password was not provided');
  }
  const salt = await bcrypt.genSalt(config.get('saltPow'));
  return bcrypt.hash(password, salt);
};

module.exports = {
  setup,
  signToken,
  hashPassword,
};
