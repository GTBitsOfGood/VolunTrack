import dbConnect from "../mongodb/index";
import Organization from "../mongodb/models/organization";

export async function inviteAdmin(email, organizationId) {
  await dbConnect();

  return await Organization.findOneAndUpdate(
    {
      _id: organizationId,
    },
    { $addToSet: { invitedAdmins: email } },
    { new: true, upsert: true }
  );
}

export async function getInvitedAdmins(organizationId) {
  await dbConnect();

  return (await Organization.findOne({ _id: organizationId })).invitedAdmins;
}

export async function removeInvitedAdmin(email, organizationId) {
  await dbConnect();

  return await Organization.findOneAndUpdate(
    { _id: organizationId },
    { $pull: { invitedAdmins: email } }
  );
}
