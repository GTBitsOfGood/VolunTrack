const WaiverData = require("../mongodb/models/waivers");
import dbConnect from "../mongodb/index";
const User = require("../mongodb/models/user");
const mongoose = require("mongoose");

export async function createWaiver(type, text, organizationId, next) {
  const newWaiver = new WaiverData(type, text, organizationId);

  await dbConnect();

  const waiver = await WaiverData.create({
    type: type,
    text: text,
    organizationId: organizationId,
  });
}

export async function getWaiver(type, organizationId) {
  await dbConnect();

  return WaiverData.find({ type: type, organizationId }).then((waiver) => {
    return waiver;
  });
}

export async function updateWaiver(waiverData, organizationId, next) {
  await dbConnect();

  return WaiverData.findOneAndUpdate(
    { type: waiverData.type, organizationId },
    waiverData,
    {
      new: true,
    }
  )
    .then(() => {
      return;
    })
    .catch((err) => {
      next(err);
    });
}

export async function deleteWaiver(type, organizationId, next) {
  await dbConnect();

  return WaiverData.findByIdAndDelete({ type: type })
    .then(() => {
      return;
    })
    .catch(next);
}
