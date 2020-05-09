const Service = require('./userService');

const forgotPassword = async (req, res) => {
  const response = await Service.forgotPassword(req.body);

  return res.status(response.status).send(response);
};

const checkCode = async (req, res) => {
  const response = await Service.checkCode(req.body);

  return res.status(response.status).send(response);
};

const resetPassword = async (req, res) => {
  const response = await Service.resetPassword(req.body);

  return res.status(response.status).send(response);
};

const updateUser = async (req, res) => {
  const validate = await Service.validateUpdateUser(req.body, req.user);
  if (validate.status !== 200)
    return res.status(validate.status).send(validate);

  const response = await Service.updateUser(
    validate.data.reqBody,
    validate.data.user,
  );
  return res.status(response.status).send(response);
};

const updatePhoto = async (req, res) => {
  const photo = req.file;
  const response = await Service.updatePhoto(req.user, photo);
  return res.status(response.status).send(response);
};

module.exports = {
  forgotPassword,
  checkCode,
  resetPassword,
  updateUser,
  updatePhoto,
};
