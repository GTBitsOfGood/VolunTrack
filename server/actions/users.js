import { ObjectId } from "mongodb";
import dbConnect from "../mongodb/index";
import User from "../mongodb/models/user";

const mongoose = require("mongoose");
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

export async function getEventVolunteers(parsedVolunteers, organizationId) {
  await dbConnect();

  let volunteerIds = parsedVolunteers.map(mongoose.Types.ObjectId);
  const volunteers = await User.find({
    _id: { $in: volunteerIds },
    organizationId,
  });

  return volunteers
    ? { status: 200, message: { volunteers } }
    : { status: 404, message: { error: "No Users found" } };
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

export async function getCount(organizationId) {
  await dbConnect();

  const count = await User.count({ organizationId });
  return { status: 200, message: { count } };
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
export async function updateUser(
  email,
  phone_number,
  first_name,
  last_name,
  date_of_birth,
  zip_code,
  address,
  city,
  state,
  notes,
  userId
) {
  //This command only works if a user with the email "david@davidwong.com currently exists in the db"
  await dbConnect();
  if (userId) createHistoryEventEditProfile(userId);

  if (!email) return { status: 400, message: { error: "Invalid email sent" } };

  if (phone_number?.length !== 0) {
    User.updateOne(
      { "bio.email": email },
      { $set: { "bio.phone_number": phone_number } }
    ).then((result) => {
      if (!result.nModified)
        return {
          status: 400,
          message: {
            error: "Email requested for update was invalid. 0 items changed.",
          },
        };
    });
  }
  if (first_name?.length !== 0) {
    User.updateOne(
      { "bio.email": email },
      { $set: { "bio.first_name": first_name } }
    ).then((result) => {
      if (!result.nModified)
        return {
          status: 400,
          message: {
            error: "Email requested for update was invalid. 0 items changed.",
          },
        };
    });
  }
  if (last_name?.length !== 0) {
    User.updateOne(
      { "bio.email": email },
      { $set: { "bio.last_name": last_name } }
    ).then((result) => {
      if (!result.nModified)
        return {
          status: 400,
          message: {
            error: "Email requested for update was invalid. 0 items changed.",
          },
        };
    });
  }

  if (phone_number?.length !== 0) {
    User.updateOne(
      { "bio.email": email },
      { $set: { "bio.phone_number": phone_number } }
    ).then((result) => {
      if (!result.nModified)
        return {
          status: 400,
          message: {
            error: "Email requested for update was invalid. 0 items changed.",
          },
        };
    });
  }

  if (date_of_birth?.length !== 0) {
    User.updateOne(
      { "bio.email": email },
      { $set: { "bio.date_of_birth": date_of_birth } }
    ).then((result) => {
      if (!result.nModified)
        return {
          status: 400,
          message: {
            error: "Email requested for update was invalid. 0 items changed.",
          },
        };
    });
  }

  if (zip_code?.length !== 0) {
    User.updateOne(
      { "bio.email": email },
      { $set: { "bio.zip_code": zip_code } }
    ).then((result) => {
      if (!result.nModified)
        return {
          status: 400,
          message: {
            error: "Email requested for update was invalid. 0 items changed.",
          },
        };
    });
  }

  if (address?.length !== 0) {
    User.updateOne(
      { "bio.email": email },
      { $set: { "bio.address": address } }
    ).then((result) => {
      if (!result.nModified)
        return {
          status: 400,
          message: {
            error: "Email requested for update was invalid. 0 items changed.",
          },
        };
    });
  }

  if (city?.length !== 0) {
    User.updateOne({ "bio.email": email }, { $set: { "bio.city": city } }).then(
      (result) => {
        if (!result.nModified)
          return {
            status: 400,
            message: {
              error: "Email requested for update was invalid. 0 items changed.",
            },
          };
      }
    );
  }

  if (state?.length !== 0) {
    User.updateOne(
      { "bio.email": email },
      { $set: { "bio.state": state } }
    ).then((result) => {
      if (!result.nModified)
        return {
          status: 400,
          message: {
            error: "Email requested for update was invalid. 0 items changed.",
          },
        };
    });
  }

  if (notes?.length !== 0) {
    User.updateOne(
      { "bio.email": email },
      { $set: { "bio.notes": notes } }
    ).then((result) => {
      if (!result.nModified)
        return {
          status: 400,
          message: {
            error: "Email requested for update was invalid. 0 items changed.",
          },
        };
    });
  }

  return { status: 200 };
}

export async function updateRole(email, role) {
  if (!email || !role)
    return { status: 400, message: { error: "Invalid email or role sent" } };

  return User.updateOne({ "bio.email": email }, { $set: { role: role } }).then(
    (result) => {
      if (!result.nModified)
        return {
          status: 400,
          message: {
            error: "Email requested for update was invalid. 0 items changed.",
          },
        };
      return { status: 200 };
    }
  );
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
