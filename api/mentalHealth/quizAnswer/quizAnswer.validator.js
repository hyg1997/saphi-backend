const { Joi } = require('celebrate');

const Post = {
  params: {
    identifier: Joi.string().required(),
  },
  body: {
    categories: Joi.array()
      .items(
        Joi.object()
          .keys({
            name: Joi.string().required(),
            questions: Joi.array()
              .items(
                Joi.object()
                  .keys({
                    name: Joi.string().required(),
                    description: Joi.string().required(),
                    answer: Joi.number()
                      .integer()
                      .min(1)
                      .max(5)
                      .required(),
                  })
                  .unknown(true),
              )
              .min(1)
              .required(),
          })
          .unknown(true),
      )
      .min(1)
      .required(),
  },
};

module.exports = {
  Post,
};
