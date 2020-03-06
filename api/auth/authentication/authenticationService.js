const express = require('express');

const { verifyPassword, hashPassword } = require('../auth/utils');
const { login } = require('../auth/strategies/jwt');
const { createUser, readUserByProperties } = require('../user/userService');

const login = async reqBody => {
  const { email, password } = reqBody;

  return res.status(200).json({ success: true, data });
};

const register =async (req, res) => {
  const { firstName, lastName, email, password } = reqBody;

  reqBody.password = await hashPassword(password);

  const user = await createUser(reqBody);

  if (err) {
    return res
      .status(500)
      .json({ success: false, data: 'Email is already taken' });
  }

  const [loginErr, token] = await to(login(req, user));

  if (loginErr) {
    console.error(loginErr);
    return res
      .status(500)
      .json({ success: false, data: 'Authentication error!' });
  }

  return res
    .status(200)
    .cookie('jwt', token, {
      httpOnly: true,
    })
    .json({
      success: true,
      data: '/',
    });
});

module.exports = router;
