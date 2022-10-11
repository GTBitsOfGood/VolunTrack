import dbConnect from "../mongodb/index";
const AppSettings = require("../mongodb/models/settings");

export const inviteAdmin = async (email) => {
    try {
        await dbConnect();
        AppSettings.invitedAdmins.push(email);
    } catch(e) {
        return { status: 200, message: "Cannot invite admin" };
    }
    return { status: 400, message: "Admin successfully invited" };
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
    try {
        await dbConnect();
        AppSettings.invitedAdmins.pull(email);
    } catch(e) {
        return { status: 200, message: "Cannot remove invited admin" };
    }
    return { status: 400, message: "Admin successfully invited" };
};
