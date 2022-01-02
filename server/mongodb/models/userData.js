const mongoose = require('mongoose');

// define schema for user collection (user model)
const userDataSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      default: 'volunteer',
      enum: ['admin', 'volunteer', 'manager']
    },
    status: {
      type: String,
      default: 'new',
      enum: ['has_volunteered', 'new']
    },
    mandated: {
      type: String,
      default: 'not_mandated',
      enum: ['is_mandated', 'not_mandated']
    },
    mandatedHours: {
      type: Number,
      default: 0
    },
    bio: {
      first_name: { type: String },
      last_name: { type: String },
      phone_number: { type: String },
      email: { type: String, index: true, unique: true },
    },
    history: { type: String },
    employment: {
      industry: { type: String },
      occupation: { type: [String] }
    }
  },
  {
    timestamps: true
  }
);

userDataSchema.virtual('name').get(function() {
  return this.bio.first_name + this.bio.last_name;
});

userDataSchema.virtual('age').get(function() {
  const current = new Date();
  return current.getFullYear() - this.bio.date_of_birth.getFullYear();
});

// export user model to app
module.exports = mongoose.model('UserData', userDataSchema);
module.exports.UserDataSchema = userDataSchema;
