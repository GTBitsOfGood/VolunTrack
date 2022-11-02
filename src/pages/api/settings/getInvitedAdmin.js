const { getInvitedAdmins } = require("../../../../server/actions/settings");

export default async function handler(req, res) {
  if (req.method === "GET") {
    let result = await getInvitedAdmins();
    if (result.status === 200) {
        res.status(200).json(result.result[0].invitedAdmins);
    } else {
        res.status(404).json("cannot find invited admin list");
    }
  }
}