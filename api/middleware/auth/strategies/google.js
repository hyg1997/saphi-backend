/* eslint-disable no-underscore-dangle */
const passport = require('passport');
const config = require('config');
const _ = require('lodash');
const { Strategy: CustomStrategy } = require('passport-custom');
const { OAuth2Client } = require('google-auth-library');

const {
  readUserByFieldIds,
  createUser,
} = require('../../../auth/user/userService');

const CLIENT_ID = config.get('googleClientId');
const client = new OAuth2Client(CLIENT_ID);

const verify = async token => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();
    return {
      googleId: payload.sub,
      email: payload.email,
      name: payload.given_name,
      lastname: payload.family_name,
    };
  } catch (error) {
    return undefined;
  }
};

const strategy = () => {
  passport.use(
    'googleLogin',
    new CustomStrategy(async (req, done) => {
      const data = await verify(req.body.idToken);
      if (!data) {
        return done(null, false, {
          status: 400,
          message: 'Invalid token provided',
        });
      }
      const user = await readUserByFieldIds({
        googleId: data.googleId,
      });
      if (user.status !== 200) return done(null, false, user);

      return done(null, user.data);
    }),
  );
  passport.use(
    'googleSignup',
    new CustomStrategy(async (req, done) => {
      const data = await verify(req.body.idToken);
      if (!data) {
        return done(null, false, {
          status: 400,
          message: 'Invalid token provided',
        });
      }
      const user = await createUser({
        ..._.omit(req.body, ['idToken']),
        googleId: data.googleId,
      });

      if (user.status !== 201) return done(null, false, user);
      return done(null, user.data);
    }),
  );
};

module.exports = {
  strategy,
};
