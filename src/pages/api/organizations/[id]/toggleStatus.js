const { toggleStatus } = require("../../../../../server/actions/organization");

export default async function handler(req, res, next) {
  if (req.method === "POST") {
    const result = await toggleStatus(req.query.id, next);
    return res
      .status(result.status)
      .json({ message: "Organization successfully toggled!" });
  }
}
