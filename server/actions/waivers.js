const WaiverData = require("../mongodb/models/waivers");
import dbConnect from "../mongodb/index";
const User = require("../mongodb/models/user");
const mongoose = require("mongoose");

export async function createWaiver(newWaiverData, organizationId, next) {
  const newWaiver = new WaiverData(newWaiverData);

  await dbConnect();

  const waiver = await WaiverData.create({
    type: newWaiverData.type,
    text: newWaiverData.text,
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
