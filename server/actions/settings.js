import dbConnect from "../mongodb/index";
import AppSettings from "../mongodb/models/AppSettings";

export const inviteAdmin = async (email, next) => {
    await dbConnect();
    return AppSettings.findOneAndUpdate(
        {},
        { $push: { email } }
      )
        .then((event) => {
          return event;
        })
        .catch((err) => {
            next(err);
            // return { status: 200, message: "Cannot invite admin" };
        });
    // try {
    //     await dbConnect();
    //     AppSettings.invitedAdmins.push(email);
    // } catch(e) {
    //     return { status: 200, message: "Cannot invite admin" };
    // }
    // return { status: 400, message: "Admin successfully invited" };
};

export const getInvitedAdmins = async (email) => {
    try {
        await dbConnect();
        return AppSettings.find(invitedAdmins);
    } catch(e) {
        return { status: 200, message: "Cannot get invited admin list" };
    }
};

export const removeInvitedAdmin = async (email) => {
    return AppSettings.findOneAndUpdate(
        {},
        { $pull: { email } }
      )
        .then((event) => {
          return event;
        })
        .catch((err) => {
            return { status: 200, message: "Cannot remove invited admin" };
        });
    // try {
    //     await dbConnect();
    //     AppSettings.invitedAdmins.pull(email);
    // } catch(e) {
    //     return { status: 200, message: "Cannot remove invited admin" };
    // }
    // return { status: 400, message: "Admin successfully invited" };
};
