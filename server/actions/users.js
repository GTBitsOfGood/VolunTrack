import { ObjectId } from "mongodb";
import dbConnect from "../mongodb/index";
import Organization from "../mongodb/models/Organization";
import User from "../mongodb/models/User";

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

import { createHistoryEventEditProfile } from "./historyEvent";
import ResetCode from "../mongodb/models/ResetCode";

export async function old_createUserFromCredentials(user) {
  await dbConnect();

  const existingUser = await User.findOne({ email: user.email });
  if (existingUser) {
    return {
      status: 400,
      message: "Email address already exists, please login",
    };
  }

  const organization = await Organization.findOne({ slug: user.org_code });
  if (!organization) {
    return {
      status: 400,
      message:
        "The entered organization code does not exist. Please contact your administrator for assistance.",
    };
  }

  if (organization.active === false) {
    return {
      status: 400,
      message: "The entered company code is currently marked as inactive.",
    };
  }

  const user_data = {
    _id: new ObjectId(),
    imageUrl: "/images/gradient-avatar.png",
    organizationId: organization._id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
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

export async function old_verifyUserWithCredentials(email, password) {
  await dbConnect();

  const user = await User.findOne({ email });

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

export async function getEventVolunteers(parsedVolunteers) {
  await dbConnect();

  let volunteerIds = parsedVolunteers.map(mongoose.Types.ObjectId);
  const volunteers = await User.find({
    _id: { $in: volunteerIds },
  });

  return volunteers
    ? { status: 200, message: { volunteers } }
    : { status: 404, message: { error: "No Users found" } };
}

export async function old_getUsers(role, next) {
  await dbConnect();
  let filter = {};
  if (role && role !== "undefined") filter = { role: role };
  return User.aggregate([
    { $sort: { _id: -1 } },
    { $match: filter },
    {
      $project: {
        name: { $concat: ["$bio.firstName", " ", "$bio.lastName"] },
        first_name: "$bio.firstName",
        last_name: "$bio.lastName",
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

export async function old_getCurrentUser(userId, next) {
  await dbConnect();

  return User.find({ _id: userId })
    .then((users) => {
      return users;
    })
    .catch(next);
}

export async function old_updateUser(id, userInfo) {
  await dbConnect();
  const { adminId } = userInfo;
  if (adminId) createHistoryEventEditProfile(adminId);
  const { role } = userInfo;
  const { bio } = userInfo;
  const { password } = userInfo;

  if (password) {
    const user = await User.findOne({ _id: mongoose.Types.ObjectId(id) });

    if (!user.passwordHash) {
      return {
        status: 400,
        message: "Please sign in with Google",
      };
    }

    const hash = await bcrypt.hash(user.bio.email + password, 10);

    await User.updateOne(
      { _id: mongoose.Types.ObjectId(id) },
      { passwordHash: hash }
    );

    await ResetCode.findOneAndDelete({ userId: mongoose.Types.ObjectId(id) });
  }

  if (bio) {
    if (!bio.email)
      return { status: 400, message: { error: "Invalid email sent" } };

    await User.updateOne(
      { _id: mongoose.Types.ObjectId(id) },
      { bio: { ...bio } }
    );
  }

  if (role) {
    await User.updateOne({ _id: mongoose.Types.ObjectId(id) }, { role: role });
  }
  return { status: 200 };
}

export async function old_getUserFromId(id, next) {
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

export async function old_deleteUserById(user, id, next) {
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
