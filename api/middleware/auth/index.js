/* eslint-disable no-param-reassign */
const passport = require('passport');
const strategies = require('./strategies');

const pipe = (...functions) => args =>
  functions.reduce((arg, fn) => fn(arg), args);

const initialiseAuthentication = app => {
  pipe(
    strategies.JWTStrategy,
    strategies.LocalStrategy,
    strategies.GoogleStrategy,
    strategies.FacebookStrategy,
  )(app);
};

const authenticateMiddleware = (strategyName, options = {}) => (
  req,
  res,
  next,
) => {
  passport.authenticate(
    strategyName,
    { ...options, session: false },
    (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        console.log(info);
        if (!info.status)
          info = {
            status: 401,
            message: 'Authentication failed.',
          };
        return res.status(info.status).send(info);
      }
      req.user = user;
      return next();
    },
  )(req, res, next);
};

module.exports = {
  initialiseAuthentication,
  authenticateMiddleware,
};
