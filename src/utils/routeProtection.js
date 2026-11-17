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
    return (
      req.body.userId === user._id.toString() ||
      req.query.userId === user._id.toString()
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
