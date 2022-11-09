const { getCurrentUser } = require("../../../../server/actions/users");

export default async function handler(req, res, next) {
  if (req.method === "GET") {
    // this is currently hardcoded
    let result = await getCurrentUser(req.query.volunteer, next);
    return res.status(200).json({
      result,
    });
  }
}
