import { ObjectId } from "mongodb";

const mongoose = require("mongoose");
import dbConnect from "../mongodb/index";
import User from "../mongodb/models/user";
const bcrypt = require("bcrypt");

import { createHistoryEventEditProfile } from "./historyEvent";

export async function createUserFromCredentials(user) {
  await dbConnect();

  const existingUser = await User.findOne({ "bio.email": user.email });
  if (existingUser) {
    return {
      status: 400,
      message: "Email address already exists, please login",
    };
  }

  const user_data = {
    _id: new ObjectId(),
    imageUrl: "/images/gradient-avatar.png",
    bio: {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
    },
  };

  bcrypt.hash(user.email + user.password, 10, async function (err, hash) {
    user_data.passwordHash = hash;
    const user = new User(user_data);
    await user.save();
  });

  return {
    status: 200,
    message: "Success!",
  };
}

export async function verifyUserWithCredentials(email, password) {
  await dbConnect();

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

export async function getEventVolunteers(parsedVolunteers, next) {
  await dbConnect();

  let volunteers = parsedVolunteers.map(mongoose.Types.ObjectId);

  return User.find({
    _id: { $in: volunteers },
  })
    .then((users) => {
      if (!users) {
        return { status: 404, message: { error: `No Users found` } };
      }
      return { status: 200, message: { users } };
    })
    .catch((err) => next(err));
}

export async function getManagementData(
  role,
  lastPaginationId,
  pageSize,
  next
) {
  await dbConnect();

  const filter = {};
  if (role) {
    try {
      // Each role is sent as an object key
      // For mongo '$or' query, these keys need to be reduced to an array
      const roleFilter = Object.keys(JSON.parse(role)).reduce(
        (query, key) => [...query, { role: key }],
        []
      );
      if (!roleFilter.length) {
        return { status: 400, message: { error: "Invalid role param" } };
      }
      filter.$or = roleFilter;
    } catch (e) {
      return { status: 400, message: { error: "Invalid role param" } };
    }
  }
  if (lastPaginationId) {
    filter._id = { $lt: mongoose.Types.ObjectId(lastPaginationId) };
  }
  return User.aggregate([
    { $sort: { _id: -1 } },
    { $match: filter },
    { $limit: parseInt(pageSize, 10) || 10 },
    {
      $project: {
        name: { $concat: ["$bio.first_name", " ", "$bio.last_name"] },
        first_name: "$bio.first_name",
        last_name: "$bio.last_name",
        email: "$bio.email",
        phone_number: "$bio.phone_number",
        date_of_birth: "$bio.date_of_birth",
        zip_code: "$bio.zip_code",
        address: "$bio.address",
        city: "$bio.city",
        state: "$bio.state",
        notes: "$bio.notes",
        role: 1,
        status: 1,
      },
    },
  ])
    .then((users) => {
      return { status: 200, message: { users } };
    })
    .catch((err) => next(err));
}

export async function getCount(next) {
  await dbConnect();

  return User.estimatedDocumentCount()
    .exec()
    .then((count) => {
      return { status: 200, message: { count } };
    })
    .catch((err) => next(err));
}

export async function getCurrentUser(userId, next) {
  await dbConnect();

  return User.find({ _id: userId })
    .then((users) => {
      return users;
    })
    .catch(next);
}

// multiple updates, not sure how to handle
// maybe run in parallel with Promise.all?
export async function updateUser(id, userInfo) {
  //This command only works if a user with the email "david@davidwong.com currently exists in the db"
  await dbConnect();
  const { adminId } = userInfo
  console.log(adminId)
  if (adminId) createHistoryEventEditProfile(adminId);
  const { role } = userInfo
  const { bio } = userInfo
  

  if (bio) {
    if (!bio.email) return { status: 400, message: { error: "Invalid email sent" } };

    await User.updateOne({ _id: mongoose.Types.ObjectId(id) }, {bio: {...bio}})
  }
  
  if (role) {
    await User.updateOne({ _id: mongoose.Types.ObjectId(id) }, {role: role})
  }
  return { status: 200 };
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
