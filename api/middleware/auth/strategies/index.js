const { strategy: JWTStrategy } = require('./jwt');
const { strategy: LocalStrategy } = require('./local');
const { strategy: GoogleStrategy } = require('./google');
const { strategy: FacebookStrategy } = require('./facebook');

module.exports = {
  JWTStrategy,
  LocalStrategy,
  GoogleStrategy,
  FacebookStrategy,
};
