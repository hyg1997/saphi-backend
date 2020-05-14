/* eslint-disable no-param-reassign */
const mongoose = require('mongoose');

const { Schema } = mongoose;
const quizAnswerSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Quiz',
    },
    identifier: {
      type: String,
      required: true,
    },
    content: [
      {
        type: mongoose.Mixed,
        // name: {
        //   type: String,
        //   required: true,
        // },
        // questions: [
        //   {
        //     name: {
        //       type: String,
        //       required: true,
        //     },
        //     description: {
        //       type: String,
        //       required: true,
        //     },
        //     answer: {
        //       type: mongoose.Mixed,
        //       required: true,
        //     },
        //   },
        // ],
      },
    ],
  },
  {
    timestamps: true,
  },
);

const QuizAnswer = mongoose.model('QuizAnswer', quizAnswerSchema);

quizAnswerSchema.pre('save', async function(next, current, callback) {
  if (this.identifier === 'wheeloflife') {
    this.content = this.content.map(category => {
      category.total = category.questions.reduce(
        (acc, cur) => acc + cur.answer,
        0,
      );
      category.mean = category.total / category.questions.length;
      return category;
    });
  }
  next();
});

module.exports = {
  quizAnswerSchema,
  QuizAnswer,
};
