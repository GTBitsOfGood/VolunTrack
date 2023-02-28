const WaiverData = require("../mongodb/models/waivers");
import dbConnect from "../mongodb/index";
const User = require("../mongodb/models/user");
const mongoose = require("mongoose");

export async function getWaiver(type, organizationId) {
  await dbConnect();

  return WaiverData.find({ type: type, organizationId: organizationId }).then(
    (waiver) => {
      return waiver;
    }
  );
}

export async function updateWaiver(type, text, organizationId) {
  await dbConnect();

  return WaiverData.findOneAndUpdate(
    { type: type, organizationId: organizationId },
    { text: text },
    {
      upsert: true,
    }
  ).then(() => {
    return;
  });
}
