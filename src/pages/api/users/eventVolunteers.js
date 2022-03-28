const { getEventVolunteers } = require("../../../../server/actions/users");

export default async function handler(req, res, next) {
  if (req.method === "GET") {
    let parsedVolunteers = JSON.parse(req.query.volunteers);
    let result = await getEventVolunteers(parsedVolunteers, next);

    res.status(result.status).json(result.message);
  }
}
