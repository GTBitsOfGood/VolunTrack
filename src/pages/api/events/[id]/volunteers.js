const { getEventVolunteersList } = require("../../../../../server/actions/events");
export default async function handler(req, res, next) {
  if (req.method === "GET") {
    const eventId = req.query.id;
    const volunteers = await getEventVolunteersList(eventId);

    res.status(200).json(volunteers); 
  }
}
