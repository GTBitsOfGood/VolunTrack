const { getInvitedAdmins } = require("../../../../server/actions/settings");

export default async function handler(req, res) {
  if (req.method === "GET") {
    const organizationId = req.query.organizationId;

    try {
      res.status(200).json(await getInvitedAdmins(organizationId));
    } catch (e) {
      res
        .status(400)
        .json(`Cannot find organization with id: ${organizationId}`);
    }
  }
}
