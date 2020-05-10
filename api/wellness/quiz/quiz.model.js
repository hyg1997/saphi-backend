const mongoose = require('mongoose');

const { Schema } = mongoose;
const quizSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    identifier: {
      type: String,
      required: true,
    },
    content: [
      {
        type: mongoose.Mixed,
        // categoryName: {
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
        //     answerFormat: {
        //       type: mongoose.Mixed,
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

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = {
  quizSchema,
  Quiz,
};
