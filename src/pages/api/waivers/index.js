import {
  createWaiver,
  getWaiver,
  deleteWaiver,
  updateWaiver,
} from "../../../../server/actions/waivers";

export default async function handler(req, res, next) {
  if (req.method === "GET") {
    const type = req.query.type;
    const organizationId = req.query.organizationId;

    if (!(type === "adult" || type === "minor")) {
      res.status(400).json({ error: "Type is not valid" });
    }
    let waiver = await getWaiver(type, organizationId);
    return res.status(200).json({
      waiver,
    });
  } else if (req.method === "POST") {
    const type = req.body.type;
    const organizationId = req.body.organizationId;
    const text = req.body.text;

    const newWaiver = await updateWaiver(type, text, organizationId);

    res.status(200).json(newWaiver);
  }
}
