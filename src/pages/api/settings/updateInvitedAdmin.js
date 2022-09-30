const { updateSettings } = require("../../../../server/actions/settings");

export default async function handler(req, res) {
  if (req.method === "POST") {
    let result = await updateSettings(req.query.email);

    if (result.status === 200) {
      res.status(200).send();
    } else {
      res.status(result.status).json(result.message);
    }
  }
}
