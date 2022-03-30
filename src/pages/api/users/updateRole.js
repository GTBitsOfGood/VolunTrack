const { updateRole } = require("../../../../server/actions/users");

export default async function handler(req, res) {
  if (req.method === "POST") {
    let result = await updateRole(req.query.email, req.query.role);

    if (result.status === 200) {
      res.status(200).send();
    } else {
      res.status(result.status).json(result.message);
    }
  }
}
