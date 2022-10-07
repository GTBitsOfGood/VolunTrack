const { getEventsByUserID } = require("../../../../server/actions/volunteerstats");

export default async function handler(req, res, next) {
  if (req.method === "GET") {
      let user = req.body.user;
      


    let result = await getEventsByUserID(user, next);
    return res.json({
      result,
    });

  }
}
