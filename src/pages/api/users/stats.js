const { getEventsByUserID } = require("../../../../server/actions/volunteerstats");

export default async function handler(req, res, next) {

  if (req.method === "GET") {
    let event = await getEventsByUserID(req.query.volunteer, next);

    return res.status(200).json({
      event,
    });
  }
}
