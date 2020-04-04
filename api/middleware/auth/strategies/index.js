const { strategy: JWTStrategy } = require('./jwt');
const { strategy: LocalStrategy } = require('./local');
const { strategy: GoogleStrategy } = require('./google');

module.exports = {
  JWTStrategy,
  LocalStrategy,
  GoogleStrategy,
};
