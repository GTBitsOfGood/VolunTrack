import { ObjectId } from "mongodb";
import dbConnect from "../mongodb/index";
import User from "../mongodb/models/user";
import Organization from "../mongodb/models/organization";

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

import { createHistoryEventEditProfile } from "./historyEvent";
import resetCode from "../mongodb/models/resetCode";

export async function createUserFromCredentials(user) {
  await dbConnect();

  const existingUser = await User.findOne({ "bio.email": user.email });
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

  console.log("HERE!");
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
  console.log("CHECKING PASSWORD");
  const match = await bcrypt.compare(email + password, user.passwordHash);
  console.log(user.passwordHash);
  const check = await bcrypt.hash(email + password, 10);
  console.log(check);
  console.log(email);
  console.log(password);

  console.log(match);

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

export async function getUsers(role, next) {
  await dbConnect();
  let filter = {};
  if (role && role !== "undefined") filter = { role: role };
  return User.aggregate([
    { $sort: { _id: -1 } },
    { $match: filter },
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

export async function getCurrentUser(userId, next) {
  await dbConnect();

  return User.find({ _id: userId })
    .then((users) => {
      return users;
    })
    .catch(next);
}

export async function updateUser(id, userInfo) {
  await dbConnect();
  const { adminId } = userInfo;
  if (adminId) createHistoryEventEditProfile(adminId);
  const { role } = userInfo;
  const { bio } = userInfo;
  const { password } = userInfo;

  if (password) {
    console.log("HERE 1");
    console.log(id);
    const user = await User.findOne({ _id: mongoose.Types.ObjectId(id) });
    console.log(user);

    console.log("HERE 2");
    if (!user.passwordHash) {
      return {
        status: 400,
        message: "Please sign in with Google",
      };
    }

    console.log("HERE 3");
    const hash = await bcrypt.hash(user.bio.email + password, 10);

    await User.updateOne(
      { _id: mongoose.Types.ObjectId(id) },
      { passwordHash: hash }
    );

    await resetCode.findOneAndDelete({ userId: mongoose.Types.ObjectId(id) });

    console.log("HERE 5");
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
