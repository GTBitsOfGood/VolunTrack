// NPM Packages
const express = require("express");
const router = express.Router();
const {
  check,
  oneOf,
  validationResult,
  matchedData,
} = require("express-validator");
const mongoose = require("mongoose");
import dbConnect from "../mongodb/index";
import User from "../mongodb/models/User";

// Local Imports
const { SendEmailError, EmailInUseError } = require("../errors");
const UserData = require("../mongodb/models/userData");
const { USER_DATA_VALIDATOR } = require("../validators");
const DEFAULT_PAGE_SIZE = 10;

//events

export async function createUser(newUserData, user, next) {
  await dbConnect();

  let userData = null;
  return User.findOne({ "bio.email": newUserData.bio.email })
    .then((userExists) => {
      if (userExists) {
        throw new EmailInUseError(
          `Email ${newUserData.bio.email} already in use`,
          newUserData.bio.email
        );
      }
      return Promise.resolve();
    })
    .then(() => {
      const newUser = new UserData(newUserData);
      return newUser.save();
    })
    .then((savedUserData) => {
      // Save data for response
      userData = savedUserData;

      if (user && !user.userDataId) {
        // First created user, associate with user credentials
        const userCreds = user;
        userCreds.userDataId = savedUserData.id;
        return userCreds.save();
      }

      return Promise.resolve();
    })
    .then(() => {
      return { status: 200, message: { userData } };
    })
    .catch((err) => {
      if (err instanceof EmailInUseError) {
        return {
          status: 400,
          message: {
            error: result.message,
            errorType: result.name,
          },
        };
      }

      // Generic error handler
      next(err);
    });
}

export async function getUsers(
  type,
  status,
  role,
  phone_number,
  date,
  availability,
  email,
  lastPaginationId,
  pageSize,
  next
) {
  await dbConnect();

  const filter = {};
  if (type) {
    return User.find({ role: type })
      .then((users) => {
        return { status: 200, message: { users } };
      })
      .catch((err) => next(err));
  }
  if (status) {
    try {
      // Each role is sent as an object key
      // For mongo '$or' query, these keys need to be reduced to an array
      const statusFilter = Object.keys(JSON.parse(status)).reduce(
        (query, key) => [...query, { status: key }],
        []
      );
      if (!statusFilter.length) {
        return { status: 400, message: { error: "Invalid status param" } };
      }
      filter.$or = statusFilter;
    } catch (e) {
      return { status: 400, message: { error: "Invalid status param" } };
    }
  }
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
  if (date) {
    try {
      const dates = JSON.parse(date).reduce(
        (query, curr) => [
          ...query,
          { createdAt: { $gte: new Date(curr.from), $lte: new Date(curr.to) } },
        ],
        []
      );
      if (dates.length)
        filter.$or = filter.$or ? [...filter.$or, ...dates] : dates;
    } catch (e) {
      return { status: 400, message: { error: "Invalid date param" } };
    }
  }
  if (availability) {
    try {
      filter.availability = JSON.parse(availability);
    } catch (e) {
      return { status: 400, message: { error: "Invalid availability param" } };
    }
  }

  //TODO: this logic came from vms, seems weird
  if (email) {
    try {
      filter.availability = JSON.parse(availability);
    } catch (e) {
      return { status: 400, message: { error: "Invalid availability param" } };
    }
  }
  if (lastPaginationId) {
    filter._id = { $lt: mongoose.Types.ObjectId(lastPaginationId) };
  }
  // Search ordered newest first, matching filters, limited by pagination size
  return User.aggregate([
    { $sort: { _id: -1 } },
    { $match: filter },
    { $limit: parseInt(pageSize, 10) || DEFAULT_PAGE_SIZE },
  ])
    .then((users) => {
      return { status: 200, message: { users } };
    })
    .catch((err) => next(err));
}

export async function getEventVolunteers(parsedVolunteers, next) {
  await dbConnect();

  let volunteers = parsedVolunteers.map(mongoose.Types.ObjectId);

  return UserData.find({
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
    { $limit: parseInt(pageSize, 10) || DEFAULT_PAGE_SIZE },
    {
      $project: {
        name: { $concat: ["$bio.first_name", " ", "$bio.last_name"] },
        first_name: "$bio.first_name",
        last_name: "$bio.last_name",
        email: "$bio.email",
        phone_number: "$bio.phone_number",
        date_of_birth: "$bio.date_of_birth",
        zip_code: "$bio.zip_code",
        total_hours: "$bio.total_hours",
        address: "$bio.address",
        city: "$bio.city",
        state: "$bio.state",
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

export async function getCurrentUser() {
  await dbConnect();

  return UserData.find({ "bio.email": "james@jameswang.com" })
    .then((users) => {
      return { status: 200, message: { users } };
    })
    .catch((err) => next(err));
}

export async function searchByContent(inputText, searchType, pageSize, next) {
  await dbConnect();

  const regexquery = { $regex: new RegExp(inputText), $options: "i" };
  const filter = {};

  switch (searchType) {
    case "All":
      filter.$or = [
        { history: regexquery },
        { "bio.first_name": regexquery },
        { "bio.last_name": regexquery },
        { "bio.email": regexquery },
        { "bio.phone_number": regexquery },
        { "bio.date_of_birth": regexquery },
        { "bio.zip_code": regexquery },
        { "bio.total_hours": regexquery },
        { "bio.address": regexquery },
        { "bio.city": regexquery },
        { "bio.state": regexquery },
      ];
      return User.aggregate([
        { $sort: { _id: -1 } },
        { $match: filter },
        { $limit: parseInt(pageSize, 10) || DEFAULT_PAGE_SIZE },
      ])
        .then((users) => {
          return { status: 200, message: { users } };
        })
        .catch((err) => next(err));
      break;
    case "History":
      filter.$or = [
        { "history.volunteer_interest_cause": regexquery },
        { "history.volunteer_support": regexquery },
        { "history.volunteer_commitment": regexquery },
        { "history.previous_volunteer_experience": regexquery },
      ];
      return User.aggregate([
        { $sort: { _id: -1 } },
        { $match: filter },
        { $limit: parseInt(pageSize, 10) || DEFAULT_PAGE_SIZE },
      ])
        .then((users) => {
          return { status: 200, message: { users } };
        })
        .catch((err) => next(err));
      break;
    case "Name":
      filter.$or = [
        { "bio.first_name": regexquery },
        { "bio.last_name": regexquery },
      ];
      return User.aggregate([
        { $sort: { _id: -1 } },
        { $match: filter },
        { $limit: parseInt(pageSize, 10) || DEFAULT_PAGE_SIZE },
      ])
        .then((users) => {
          return { status: 200, message: { users } };
        })
        .catch((err) => next(err));
      break;
    case "Email":
      filter.$or = [{ "bio.email": regexquery }];
      return User.aggregate([
        { $sort: { _id: -1 } },
        { $match: filter },
        { $limit: parseInt(pageSize, 10) || DEFAULT_PAGE_SIZE },
      ])
        .then((users) => {
          return { status: 200, message: { users } };
        })
        .catch((err) => next(err));
      break;
    case "Phone Number":
      filter.$or = [{ "bio.phone_number": regexquery }];
      return User.aggregate([
        { $sort: { _id: -1 } },
        { $match: filter },
        { $limit: parseInt(pageSize, 10) || DEFAULT_PAGE_SIZE },
      ])
        .then((users) => {
          return { status: 200, message: { users } };
        })
        .catch((err) => next(err));
      break;
    default:
      filter.$or = [
        { "history.volunteer_interest_cause": regexquery },
        { "history.volunteer_support": regexquery },
        { "history.volunteer_commitment": regexquery },
        { "history.previous_volunteer_experience": regexquery },
        { "bio.first_name": regexquery },
        { "bio.last_name": regexquery },
        { "bio.email": regexquery },
        { "bio.phone_number": regexquery },
      ];
      return User.aggregate([
        { $sort: { _id: -1 } },
        { $match: filter },
        { $limit: parseInt(pageSize, 10) || DEFAULT_PAGE_SIZE },
      ])
        .then((users) => {
          return { status: 200, message: { users } };
        })
        .catch((err) => next(err));
  }
}

export async function updateStatus(email, status) {
  await dbConnect();

  if (!email || !status)
    return { status: 400, message: { error: "Invalid email or status sent" } };

  return User.updateOne(
    { "bio.email": email },
    { $set: { status: status } }
  ).then((result) => {
    if (!result.nModified)
      return {
        status: 400,
        message: {
          error: "Email requested for update was invalid. 0 items changed.",
        },
      };
    return { status: 200 };
  });
}

// multiple updates, not sure how to handle
// maybe run in parallel with Promise.all?
export async function updateUser(email, phone_number, first_name, last_name, date_of_birth, zip_code, total_hours, address, city, state) {
  //This command only works if a user with the email "david@davidwong.com currently exists in the db"
  await dbConnect();

  if (!email) return { status: 400, message: { error: "Invalid email sent" } };

  if (phone_number) {
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
  if (first_name) {
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
  if (last_name) {
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
      return { status: 200 };
    });
  }

  if (phone_number) {
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
      return { status: 200 };
    });
  }

  if (date_of_birth) {
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
      return { status: 200 };
    });
  }

  if (total_hours) {
    User.updateOne(
      { "bio.email": email },
      { $set: { "bio.total_hours": total_hours } }
    ).then((result) => {
      if (!result.nModified)
        return {
          status: 400,
          message: {
            error: "Email requested for update was invalid. 0 items changed.",
          },
        };
      return { status: 200 };
    });
  }

  if (zip_code) {
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
      return { status: 200 };
    });
  }

  if (address) {
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
      return { status: 200 };
    });
  }

  if (city) {
    User.updateOne(
      { "bio.email": email },
      { $set: { "bio.city": city } }
    ).then((result) => {
      if (!result.nModified)
        return {
          status: 400,
          message: {
            error: "Email requested for update was invalid. 0 items changed.",
          },
        };
      return { status: 200 };
    });
  }

  if (state) {
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
      return { status: 200 };
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

export async function updateUserId(userDataReq, events, id, action, next) {
  return User.findById(id)
    .then((user) => {
      if (!user) {
        return {
          status: 404,
          message: { error: `No user found with id: ${id}` },
        };
      }

      if (action === "appendEvent") {
        events.forEach((eventId) => user.events.push(eventId));
      } else if (action === "removeEvents") {
        events.forEach((eventId) =>
          user.events.splice(user.events.indexOf(eventId), 1)
        );
      }

      delete userDataReq.id; // we do not want to update the user's id
      updateUserObjectFromRequest(userDataReq, user);

      // Save to db
      return user.save();
    })
    .then((user) => {
      return { status: 200, message: { user } };
    })
    .catch((err) => {
      console.log(err);
      if (err instanceof SendEmailError) {
        return {
          status: 400,
          message: {
            error: err.message,
            errorType: err.name,
          },
        };
      }

      // Generic error handler
      next(err);
    });
}

export async function deleteUserId(user, id, next) {
  if (user && user.userDataId === id) {
    // User is trying to remove themselves, don't let that happen...
    return { status: 403, message: { error: "Cannot delete yourself!" } };
  }

  return User.findByIdAndRemove(id)
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

/**
 * Side Affect: Modifies `dbUser`
 */
function updateUserObjectFromRequest(reqUser, dbUser) {
  for (const key1 in reqUser) {
    // eslint-disable-next-line no-prototype-builtins
    if (reqUser.hasOwnProperty(key1)) {
      const obj = reqUser[key1];
      const userObj = dbUser[key1];
      for (const key2 in obj) {
        // eslint-disable-next-line no-prototype-builtins
        if (obj.hasOwnProperty(key2)) {
          userObj[key2] = obj[key2] !== undefined ? obj[key2] : userObj[key2];
        }
      }
      dbUser[key1] = userObj;
    }
  }
}
