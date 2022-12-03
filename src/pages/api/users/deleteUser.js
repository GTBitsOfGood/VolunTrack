import { deleteUserId } from "../../../../server/actions/users";

export default async function handler(req, res) {
  if (req.method === "POST") {
    console.log("Delete user POST");
  }

  console.log(req.query.id);
  let result = await deleteUserId(req.query.id);

  if (result.status === 200) {
    res.status(200).send();
  } else {
    res.status(result.status).json(result.message);
  }
}
