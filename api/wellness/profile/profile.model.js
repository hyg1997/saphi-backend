const mongoose = require('mongoose');
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
                state: {
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

const Profile = mongoose.model('Profile', profileSchema);

module.exports = {
  profileSchema,
  Profile,
};
