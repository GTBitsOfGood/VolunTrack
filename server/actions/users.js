import User from "../mongodb/models/user";

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

export async function verifyUserWithCredentials(email, password) {
  const user = await User.findOne({ "bio.email": email });

  if (!user) {
    return {
      status: 404,
      message: "Email address not found, please create an account",
    };
  }

  if (!user.passwordHash) {
    return {
      status: 400,
      message: "Please sign in with Google",
    };
  }
  const match = await bcrypt.compare(email + password, user.passwordHash);

  if (match)
    return {
      status: 200,
      message: user,
    };
  else
    return {
      status: 400,
      message: "Password is incorrect",
    };
}

export async function getUserFromId(id, next) {
  return User.findById(id)
    .then((user) => {
      if (!user) {
        return {
          status: 404,
          message: { error: `No user found with id: ${id}` },
        };
      }
      return { status: 200, message: { user } };
    })
    .catch((err) => next(err));
}

export async function deleteUserById(user, id, next) {
  // if (user && user.userDataId === id) {
  //   // User is trying to remove themselves, don't let that happen...
  //   return { status: 403, message: { error: "Cannot delete yourself!" } };
  // }

  return User.findOneAndRemove({ _id: id })
    .then((removed) => {
      if (!removed) {
        return {
          status: 404,
          message: { error: `No user found with id: ${id}` },
        };
      }

      return { status: 200, message: { removed } };
    })
    .catch((err) => next(err));
}
