const { searchByContent } = require("../../../../server/actions/users");

export default async function handler(req, res, next) {
  if (req.method === "GET") {
    let result = await searchByContent(
      req.query.searchquery,
      req.query.searchtype,
      req.query.pageSize,
      next
    );
    res.status(result.status).json(result.message);
  }
}
