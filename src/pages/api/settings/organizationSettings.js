import {
  getOrganizationData,
  updateOrganizationData,
} from "../../../../server/actions/settings";

export default async function handler(req, res, next) {
  if (req.method === "GET") {
    const organizationId = req.query.organizationId;

    let orgData = await getOrganizationData(organizationId);
    return res.status(200).json({
      orgData,
    });
  } else if (req.method === "PUT") {
    const body = req.body.organizationData;
    const organizationId = req.query.organizationId;

    const updateOrg = await updateOrganizationData(body.data, organizationId);

    res.status(200).json(updateOrg);
  }
}
