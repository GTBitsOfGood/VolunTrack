import { updateUser } from "../../../../server/actions/users";

const {
  getUserFromId,
  deleteUserById,
} = require("../../../../server/actions/users");

export default async function handler(req, res, next) {
  let result;
  if (req.method === "POST") {
    result = await updateUser(req.query.id, req.body);
  } else if (req.method === "DELETE") {
    result = await deleteUserById(req.body.user, req.query.id, next);
  } else {
    result = await getUserFromId(req.query.id, next);
  }
  res.status(result.status).json(result.message);
}
