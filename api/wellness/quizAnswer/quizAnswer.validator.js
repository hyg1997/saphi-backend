const { Joi } = require('celebrate');

const Post = {
  params: {
    identifier: Joi.string().required(),
  },
  body: {
    content: Joi.array()
      .items(Joi.object().unknown(true))
      .min(1)
      .required(),
  },
};

module.exports = {
  Post,
};
