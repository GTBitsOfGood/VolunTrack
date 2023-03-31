import dbConnect from "../mongodb/";
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

export async function getOrganizationData(organizationId) {
  await dbConnect();

  return await Organization.findOne({ _id: organizationId });
}

export async function updateOrganizationData(data, organizationId) {
  await dbConnect();

  return Organization.findOneAndUpdate(
    { _id: organizationId },
    { $set: data },
    {
      new: true,
    }
  );
}
