/* eslint-disable no-underscore-dangle */
const passport = require('passport');
const config = require('config');
const _ = require('lodash');
const { Strategy: CustomStrategy } = require('passport-custom');
const { Strategy: GoogleStrategy } = require('passport-token-google2');

const { OAuth2Client } = require('google-auth-library');

const {
  readUserByFieldIds,
  createUser,
} = require('../../../auth/user/userService');

const CLIENT_ID = config.get('googleClientId');
const CLIENT_ID_ANDROID = config.get('googleClientIdAndroid');
const CLIENT_ID_IOS = config.get('googleClientIdIOS');
const CLIENT_SECRET = config.get('googleClientSecret');
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
      lastName: payload.family_name,
    };
  } catch (error) {
    return undefined;
  }
};

const strategy = () => {
  passport.use(
    'googleLogin2',
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
    'googleSignup2',
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

  passport.use(
    'googleLogin',
    new GoogleStrategy(
      {
        clientID: [CLIENT_ID, CLIENT_ID_ANDROID, CLIENT_ID_IOS],
        clientSecret: CLIENT_SECRET,
        passReqToCallback: true,
      },
      async (req, accessToken, refreshToken, profile, done) => {
        const user = await readUserByFieldIds({
          googleId: profile.id,
        });
        if (user.status !== 200) return done(null, false, user);

        return done(null, user.data);
      },
    ),
  );
  passport.use(
    'googleSignup',
    new GoogleStrategy(
      {
        clientID: [CLIENT_ID, CLIENT_ID_ANDROID, CLIENT_ID_IOS],
        clientSecret: CLIENT_SECRET,
        passReqToCallback: true,
      },
      async (req, accessToken, refreshToken, profile, done) => {
        const user = await createUser({
          ..._.omit(req.body, ['access_token']),
          googleId: profile.id,
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
