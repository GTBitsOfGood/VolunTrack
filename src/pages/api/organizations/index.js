import dbConnect from "../../../../server/mongodb";

const {
  createOrganization,
} = require("../../../../server/actions/organization");
import Organization from "../../../../server/mongodb/models/organization";

export default async function handler(req, res, next) {
  if (req.method === "POST") {
    let result = await createOrganization(req.body, next);
    res.status(result.status).json(result.message);
  }
}
