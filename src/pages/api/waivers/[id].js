import { deleteWaiver } from "../../../../server/actions/waivers";

export default async (req, res) => {
  const {
    query: { id },
    method,
  } = req;

  if (method === "DELETE") {
    const { status, message } = await deleteWaiver(id);
    res.status(status).json({ message });
  }
};
