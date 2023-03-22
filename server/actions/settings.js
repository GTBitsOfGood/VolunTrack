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

export async function getOrganizationData(organizationId) {
  await dbConnect();
  // get organization data from the database, and return it

  return await Organization.findOne({ _id: organizationId });
}

export async function updateOrganizationData(organizationData, organizationId) {
  await dbConnect();

  // update the organization data in the database
  return await Organization.findOneAndUpdate(
    { _id: organizationId },
    {
      name: organizationData.data.name,
      website: organizationData.data.website,
      notificationEmail: organizationData.data.notificationEmail,

      primaryColor: organizationData.data.primaryColor,
      imageURL: organizationData.data.imageURL,

      defaultEventState: organizationData.data.defaultEventState,
      defaultEventCity: organizationData.data.defaultEventCity,
      defaultEventAddress: organizationData.data.defaultEventAddress,
      defaultEventZip: organizationData.data.defaultEventZip,
      defaultContactName: organizationData.data.defaultContactName,
      defaultContactEmail: organizationData.data.defaultContactEmail,
      defaultContactPhone: organizationData.data.defaultContactPhone,

      eventSilver: organizationData.data.eventSilver,
      eventGold: organizationData.data.eventGold,
      hoursSilver: organizationData.data.hoursSilver,
      hoursGold: organizationData.data.hoursGold,
    },
    {
      upsert: true,
    }
  ).then(() => {
    return;
  });
}
