import { updateUser } from "../../../../server/actions/users";

const { check, validationResult } = require("express-validator");
const {
  getUserFromId,
  deleteUserById,
} = require("../../../../server/actions/users");

export default async function handler(req, res, next) {
  if (req.method === "GET") {
    // Not 100% sure this works
    check("id").isMongoId();

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.mapped() });
    }

    let result = await getUserFromId(req.query.id, next);
    res.status(result.status).json(result.message);
  } else if (req.method === "POST") {
    check("id").isMongoId();
    const id = req.query.id
    const user = req.body;
    let result = await updateUser(id, user);
    res.status(result.status).json(result.message);
  } else if (req.method === "DELETE") {
    check("id").isMongoId();

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.mapped() });
    }

    let result = await deleteUserById(req.body.user, req.query.id, next);
    res.status(result.status).json(result.message);
  }
}
