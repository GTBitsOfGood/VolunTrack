// NPM Packages
const { check } = require("express-validator");

// TODO: Convert this into custom middlewares using next-connect

// TODO: maybe just delete this because it results in fatal, hard to trace errors

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
  check("isNotifyAdmin").isBoolean(),
  check("sendReminderEmail").isBoolean(),
  check("requiresApproval").isBoolean(),
  check("isNotifyAdmin").isBoolean(),

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

  check("userId").optional(),
];

const OBJECT_ID_REGEX = new RegExp("^[0-9a-fA-F]{24}$");

const isValidObjectID = (id) => OBJECT_ID_REGEX.test(id);

module.exports = {
  CREATE_EVENT_VALIDATOR,
  isValidObjectID,
};
