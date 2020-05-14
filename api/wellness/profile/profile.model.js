/* eslint-disable no-param-reassign */
const mongoose = require('mongoose');
const _ = require('lodash');
const { PROGESS_STATUS, getDictValues } = require('../../utils/constants');

const { Schema } = mongoose;
const profileSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    wheelOfLife: {
      answer: {
        completed: { type: Boolean, default: false },
        content: Object,
      },
      pastAnswer: {
        completed: { type: Boolean, default: false },
        content: Object,
      },
    },
    modules: [
      {
        module: {
          type: mongoose.ObjectId,
          required: true,
          ref: 'Module',
        },
        name: { type: String },
        chapters: [
          {
            chapter: {
              type: mongoose.ObjectId,
              required: true,
              ref: 'Chapter',
            },
            name: { type: String },
            activities: [
              {
                activity: {
                  type: mongoose.ObjectId,
                },
                name: { type: String },
                status: {
                  type: String,
                  enum: getDictValues(PROGESS_STATUS),
                },
                completionDate: { type: Date },
              },
            ],
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  },
);

profileSchema.statics.findByUserIdAndUpdateWheel = async function(
  userId,
  wheelAnswer,
) {
  const profile = await this.findOne({ user: userId });
  profile.wheelOfLife.pastAnswer = { ...profile.wheelOfLife.answer };
  profile.wheelOfLife.answer = {
    completed: true,
    content: _.pick(wheelAnswer, ['_id', 'content', 'createdAt', 'updatedAt']),
  };
  await profile.save();

  return profile;
};

const Profile = mongoose.model('WellnessProfile', profileSchema);

module.exports = {
  profileSchema,
  Profile,
};
