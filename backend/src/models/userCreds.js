const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const UserData = require('./userData');

// define schema for user collection (user model)
const userCredsSchema = new mongoose.Schema(
  {
    googleId: { type: String, required: true, index: true, unique: true },
    accessToken: { type: String, required: true },
    refreshToken: { type: String },
    userDataId: { type: ObjectId }
  },
  {
    timestamps: true
    // toJSON: {
    //   getters: true,
    //   virtuals: true
    // }
  }
);

userCredsSchema.statics.findOrCreate = function(
  accessToken,
  refreshToken,
  profile,
  cb
) {
  const that = this;
  return this.findOne(
    {
      googleId: profile.id
    },
    (err, user) => {
      // no user was found, lets create a new one
      if (!user) {
        const { email, given_name, family_name } = profile._json;
        const newUserData = new UserData({
          bio: { email, first_name: given_name, last_name: family_name }
        });

        newUserData.save((err1, savedUserData) => {
          if (err1) return console.error(err1);
          const newUser = new that({
            googleId: profile.id,
            accessToken,
            refreshToken,
            userDataId: savedUserData.id
          });
          newUser.save((error, savedUser) => cb(error, savedUser));
        });
      } else {
        // user found.
        return cb(err, user);
      }
    }
  );
};

// export user model to app
module.exports = mongoose.model('UserCreds', userCredsSchema);
