// NPM Packages
const { check } = require("express-validator");
const mongoose = require("mongoose");

// TODO: Convert this into custom middlewares using next-connect

// TODO: maybe just delete this because it results in fatal, hard to trace errors

// TODO Add validations for events and survey_responses Array
const USER_DATA_VALIDATOR = [
  check("bio.first_name").isAlpha().trim().escape(),
  check("bio.last_name").isAlpha().trim().escape(),
  check("bio.phone_number").isAscii().trim().escape(),
  check("bio.email").isEmail().trim(),
  check("bio.date_of_birth").exists().trim().escape(),
  // check("history.volunteer_interest_cause").isAscii().trim().escape(),
  // check("history.volunteer_support").isAscii().trim().escape(),
  // check("history.volunteer_commitment").isAscii().trim().escape(),
  // check("history.previous_volunteer_experience").isAscii().trim().escape(),
  // check("availability.weekday_mornings").isBoolean(),
  // check("availability.weekday_afternoons").isBoolean(),
  // check("availability.weekday_evenings").isBoolean(),
  // check("availability.weekend_mornings").isBoolean(),
  // check("availability.weekend_afternoons").isBoolean(),
  // check("availability.weekend_evenings").isBoolean(),
  // check("referral.friend").isBoolean(),
  // check("referral.newsletter").isBoolean(),
  // check("referral.event").isBoolean(),
  // check("referral.volunteer_match").isBoolean(),
  // check("referral.internet").isBoolean(),
  // check("referral.social_media").isBoolean(),
  // check("employment.name").isAscii().trim().escape(),
  // check("employment.position").isAscii().trim().escape(),
  // check("employment.duration").isAscii().trim().escape(),
  // check("employment.location").isAscii().trim().escape(),
  // check("employment.previous_name").isAscii().trim().escape(),
  // check("employment.previous_reason_for_leaving").isAscii().trim().escape(),
  // check("employment.previous_location").isAscii().trim().escape(),
  // check("reference.name").isAscii().trim().escape(),
  // check("reference.phone_number").isAscii().trim().escape(),
  // check("reference.email").isEmail().trim().escape(),
  // check("reference.relationship").isAscii().trim().escape(),
  // check("reference.duration").isAscii().trim().escape(),
  // check("criminal.felony").isBoolean(),
  // check("criminal.sexual_violent").isBoolean(),
  // check("criminal.drugs").isBoolean(),
  // check("criminal.driving").isBoolean(),
  // check("criminal.none").isBoolean(),
  // check("criminal.explanation").isAscii().trim().escape(),
  // check("ice.name").isAscii().trim().escape(),
  // check("ice.relationship").isAscii().trim().escape(),
  // check("ice.phone_number").isAscii().trim().escape(),
  // check("ice.email").isEmail().trim().escape(),
  // check("ice.address").isAscii().trim().escape(),
  // check("permissions.reference").isBoolean(),
  // check("permissions.personal_image").isBoolean(),
  // check("permissions.email_list").isBoolean(),
  // check("permissions.signature").isAscii().trim().escape(),
];

// TODO Add validations for volunteers Array
const CREATE_EVENT_VALIDATOR = [
  check("_id").optional(),
  check("title").isAscii().trim(),
  check("date").exists(),
  check("startTime").exists(),
  check("endTime").exists(),
  check("isPrivate").isAscii().trim(),
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
