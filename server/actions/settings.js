import dbConnect from "../mongodb/index";
import AppSettings from "../mongodb/models/AppSettings";

export async function inviteAdmin(email, next) {
  await dbConnect();
  return AppSettings.findOneAndUpdate(
    {},
    { $push: { invitedAdmins: email } },
    { new: true, upsert: true }
  )
    .then((event) => {
      return event;
    })
    .catch((err) => {
      next(err);
    });
}

export async function getInvitedAdmins() {
  try {
    await dbConnect();
    return AppSettings.find({}).then((result) => {
      return {
        status: 200,
        result: result,
      };
    });
  } catch (e) {
    return { status: 400, message: "Cannot get invited admin list" };
  }
}

export async function removeInvitedAdmin(email) {
  return AppSettings.findOneAndUpdate(
    {},
    { $pull: { invitedAdmins: email } },
    { new: true }
  )
    .then((event) => {
      return event;
    })
    .catch((err) => {
      return { status: 400, message: "Cannot remove invited admin" };
    });
  // try {
  //     await dbConnect();
  //     AppSettings.invitedAdmins.pull(email);
  // } catch(e) {
  //     return { status: 200, message: "Cannot remove invited admin" };
  // }
  // return { status: 400, message: "Admin successfully invited" };
}
