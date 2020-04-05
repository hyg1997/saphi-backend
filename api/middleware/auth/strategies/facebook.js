/* eslint-disable no-underscore-dangle */
const passport = require('passport');
const config = require('config');
const _ = require('lodash');
const FacebookTokenStrategy = require('passport-facebook-token');
const { OAuth2Client } = require('google-auth-library');

const {
  readUserByFieldIds,
  createUser,
} = require('../../../auth/user/userService');

const CLIENT_ID = config.get('facebookClientId');
const CLIENT_SECRET = config.get('facebookClientSecret');

const strategy = () => {
  passport.use(
    'facebookLogin',
    new FacebookTokenStrategy(
      {
        clientID: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        fbGraphVersion: 'v6.0',
        passReqToCallback: true,
      },
      async (req, accessToken, refreshToken, profile, done) => {
        const user = await readUserByFieldIds({
          facebookId: profile.id,
        });
        if (user.status !== 200) return done(null, false, user);

        return done(null, user.data);
      },
    ),
  );
  passport.use(
    'facebookSignup',
    new FacebookTokenStrategy(
      {
        clientID: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        fbGraphVersion: 'v6.0',
        passReqToCallback: true,
      },
      async (req, accessToken, refreshToken, profile, done) => {
        const user = await createUser({
          ..._.omit(req.body, ['access_token']),
          facebookId: profile.id,
        });
        if (user.status !== 201) return done(null, false, user);

        return done(null, user.data);
      },
    ),
  );
};

module.exports = {
  strategy,
};
