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

    let waiver = await getWaiver(type, organizationId, next);
    return res.status(200).json({
      waiver,
    });
  } else if (req.method === "DELETE") {
    const type = req.query.type;
    const organizationId = req.query.organizationId;
    if (!(type === "adult" || type === "minor")) {
      res.status(400).json({ error: "Type is not valid" });
    }

    await deleteWaiver(type, organizationId, next);

    res.json({
      message: "Event successfully deleted!",
    });
  } else if (req.method === "PUT") {
    const type = req.query.type;
    const organizationId = req.query.organizationId;
    const text = req.body;

    // THIS NEEDS TO BE CHANGED!
    const updatedWaiver = await updateWaiver(type, text, organizationId);

    res.status(200).json(updatedWaiver);
  } else if (req.method === "POST") {
    const type = req.body.type;
    const organizationId = req.body.organizationId;
    const text = req.body.text;

    // THIS NEEDS TO BE CHANGED!
    const newWaiver = await createWaiver(type, text, organizationId);

    res.status(200).json(newWaiver);
  }
}
