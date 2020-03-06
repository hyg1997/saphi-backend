const express = require('express');
const { celebrate } = require('celebrate');

const { verifyPassword, hashPassword } = require('../../middleware/auth/utils');
const { login } = require('../../middleware/auth/strategies');
const { createUser, readUserByProperties } = require('../user/userService');
const Validator = require('./authenticationValidator');

const router = express.Router();

router.post('/login', celebrate(Validator.Login), async (req, res) => {
  const { email, password } = req.body;

  return res.status(200).json({ success: true, data });
});

router.post('/register', celebrate(Validator.Register), async (req, res) => {
  req.body.password = await hashPassword(req.body.password);

  const user = await createUser(req.body);

  if (user.status !== 201) return res.status(user.status).send(user);

  const token = user.data.generateAuthToken();

  return res.status(user.status).send({ ...user, token });
});

module.exports = router;
