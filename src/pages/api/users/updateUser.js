const { updateUser } = require("../../../../server/actions/users");

export default async function handler(req, res) {
  if (req.method === "POST") {
    const user = req.body
    const id = req.query.id
    let result = await updateUser(id, user);

    if (result.status === 200) {
      res.status(200).send();
    } else {
      res.status(result.status).json(result.message);
    }
  }
}
