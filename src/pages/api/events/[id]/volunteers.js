const {
  getEventVolunteersList,
} = require("../../../../../server/actions/events");
// eslint-disable-next-line no-unused-vars
export default async function handler(req, res, next) {
  if (req.method === "GET") {
    const eventId = req.query.id;
    const volunteers = await getEventVolunteersList(eventId);

    res.status(200).json(volunteers);
  }
}
