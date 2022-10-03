const { inviteAdmin } = require("../../../../server/actions/settings");

export default async function handler(req, res) {
  if (req.method === "POST") {
    let result = await inviteAdmin(req.query.email);

    if (result.status === 200) {
      res.status(200).send();
    } else {
      res.status(result.status).json(result.message);
    }
  }
}
