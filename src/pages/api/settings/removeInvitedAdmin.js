const { removeInvitedAdmin } = require("../../../../server/actions/settings");

export default async function handler(req, res) {
  if (req.method === "POST") {
    const email = req.body.email;
    const organizationId = req.body.organizationId;

    let result = await removeInvitedAdmin(email, organizationId);
    res.status(200).json(result);
  }
}
