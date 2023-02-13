import dbConnect from "../../../../server/mongodb";

const {
  createUserFromCredentials,
} = require("../../../../server/actions/users");
import User from "../../../../server/mongodb/models/user";

export default async function handler(req, res, next) {
  if (req.method === "POST") {
    let result = await createUserFromCredentials(req.body, next);
    res.status(result.status).json(result.message);
  } else if (req.method === "GET") {
    // Get all users
    await dbConnect();
    User.find({}).then((users) => res.status(200).json(users));
  }
}
