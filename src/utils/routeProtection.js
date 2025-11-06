import { getServerSession } from "next-auth/next";
import { authOptions } from "../pages/api/auth/[...nextauth]";
import Organization from "../../server/mongodb/models/Organization";

export async function isAdmin(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user) {
    return false;
  } else {
    const user = session.user;
    return user.role === "admin";
  }
}

export async function isOwnUser(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user) {
    return false;
  } else {
    const user = session.user;
    // Accept user identity from body.userId, query.userId, or dynamic route param query.id
    const bodyUserId = req.body?.userId;
    const queryUserId = req.query?.userId;
    let routeId = req.query?.id;
    if (Array.isArray(routeId)) routeId = routeId[0];

    const currentUserId = user._id?.toString();

    return (
      (typeof bodyUserId === "string" && bodyUserId === currentUserId) ||
      (typeof queryUserId === "string" && queryUserId === currentUserId) ||
      (typeof routeId === "string" && routeId === currentUserId)
    );
  }
}

export async function isBoGAdmin(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user) {
    return false;
  } else {
    const user = session.user;

    return user.isBitsOfGoodAdmin;
  }
}

export async function isOriginalOrgAdmin(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user) {
    return false;
  } else {
    const user = session.user;

    const userOrganization = await Organization.findById(user.organizationId);
    if (!userOrganization) {
      return false;
    }

    return userOrganization.originalAdminEmail === user.email;
  }
}
