const mongoose = require('mongoose');

const { Schema } = mongoose;
const profileSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
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
