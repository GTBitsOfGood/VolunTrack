const { updateStatus } = require("../../../../server/actions/users");

export default async function handler(req, res) {
  if (req.method === "POST") {
    let result = await updateStatus(req.query.email, req.query.status);

    if (result.status === 200) {
      res.status(200).send();
    } else {
      res.status(result.status).json(result.message);
    }
  }
}
