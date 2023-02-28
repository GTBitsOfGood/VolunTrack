const {
  createOrganization, fetchOrganizations
} = require("../../../../server/actions/organization");

export default async function handler(req, res, next) {
  if (req.method === "POST") {
    let result = await createOrganization(req.body, next);
    res.status(result.status).json(result.message);
  } else if (req.method === "GET") {
    let result = await fetchOrganizations();
    res.status(result.status).json(result.message);
  }
}
