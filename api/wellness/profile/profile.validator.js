const { Joi } = require('celebrate');

const { PROGESS_STATUS } = require('../../utils/constants');

const PutActivityStatus = {
  body: {
    moduleId: Joi.objectId().required(),
    chapterId: Joi.objectId().required(),
    activityId: Joi.objectId().required(),
    status: Joi.string()
      .valid(PROGESS_STATUS.completed)
      .required(),
  },
};

module.exports = { PutActivityStatus };
