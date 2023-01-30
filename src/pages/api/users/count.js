const { getCount } = require("../../../../server/actions/users");

export default async function handler(req, res) {
  if (req.method === "GET") {
    let result = await getCount(req.query.organizationId);
    res.status(result.status).json(result.message);
  }
}
