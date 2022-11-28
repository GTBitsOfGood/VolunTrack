// NPM Packages
const { check } = require("express-validator");

// TODO: Convert this into custom middlewares using next-connect

// TODO: maybe just delete this because it results in fatal, hard to trace errors

const USER_DATA_VALIDATOR = [
  check("bio.first_name").isAlpha().trim().escape(),
  check("bio.last_name").isAlpha().trim().escape(),
  check("bio.phone_number").isAscii().trim().escape(),
  check("bio.email").isEmail().trim(),
  check("bio.date_of_birth").exists().trim().escape(),
];

// TODO Add validations for volunteers Array
const CREATE_EVENT_VALIDATOR = [
  check("_id").optional(),
  check("title").isAscii().trim(),
  check("date").exists(),
  check("startTime").exists(),
  check("endTime").exists(),
  check("localTime").exists(),
  check("isPrivate").exists(),
  check("isValidForCourtHours").isBoolean(),

  check("address").isAscii().trim(),
  check("city").isAscii().trim(),
  check("zip").isAscii().trim().escape(),
  check("state").optional().isAscii().trim(),
  check("max_volunteers").isAscii().trim(),
  check("description").optional(),

  check("eventContactPhone").isAscii().trim(),
  check("eventContactEmail").isEmail().trim(),

  check("pocName").optional().trim(),
  check("pocEmail").optional().trim(),
  check("pocPhone").optional().trim().escape(),

  check("orgName").optional().trim(),
  check("orgAddress").optional().trim(),
  check("orgCity").optional().trim(),
  check("orgZip").optional().trim().escape(),
  check("orgState").optional().trim(),
];

const OBJECT_ID_REGEX = new RegExp("^[0-9a-fA-F]{24}$");

const isValidObjectID = (id) => OBJECT_ID_REGEX.test(id);

module.exports = {
  USER_DATA_VALIDATOR,
  CREATE_EVENT_VALIDATOR,
  isValidObjectID,
};
