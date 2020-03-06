/* eslint-disable no-underscore-dangle */
const passport = require('passport');
const config = require('config');

const { Strategy: JWTStrategy, ExtractJwt } = require('passport-jwt');

const { readUser } = require('../../../auth/user/userService');
const { signToken } = require('../utils');

const strategy = () => {
  const strategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.get('jwtSecret'),
    passReqToCallback: true,
  };

  const verifyCallback = async (req, jwtPayload, cb) => {
    const user = await readUser({ id: jwtPayload.data._id });

    if (user.status !== 200) {
      return cb(user);
    }
    req.user = user.data;
    return cb(null, user);
  };

  passport.use(new JWTStrategy(strategyOptions, verifyCallback));
};

const login = (req, user) => {
  req.login(user, { session: false }, err => {
    if (err) {
      return reject(err);
    }

    return resolve(signToken(user));
  });
};

module.exports = {
  strategy,
  login,
};
