const { getCount } = require("../../../../server/actions/users");

export default async function handler(req, res, next) {
  if (req.method === "GET") {
    let result = await getCount(next);
    res.status(result.status).json(result.message);
  }
}
