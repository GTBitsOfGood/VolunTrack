const { inviteAdmin } = require("../../../../server/actions/settings");

export default async function handler(req, res) {
  if (req.method === "POST") {
    const email = req.body.email;
    let result = await inviteAdmin(email);

    res.status(200).json(result);
  }
}
