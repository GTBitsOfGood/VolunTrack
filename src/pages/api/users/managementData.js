const { getManagementData } = require("../../../../server/actions/users");

export default async function handler(req, res, next) {
  if (req.method === "GET") {
    let result = await getManagementData(
      req.query.role,
      req.query.lastPaginationId,
      req.query.pageSize,
      next
    );
    res.status(result.status).json(result.message);
  }
}
