import bcrypt, { hash } from "bcrypt";
import { Types } from "mongoose";
import dbConnect from "../mongodb/";
import Attendance from "../mongodb/models/Attendance";
import Organization from "../mongodb/models/Organization";
import Registration from "../mongodb/models/Registration";
import User, { UserDocument, UserInputClient } from "../mongodb/models/User";
import { createHistoryEventEditProfile } from "./historyEvent";

export const getUsers = async (
  organizationId?: Types.ObjectId,
  role?: "admin" | "volunteer" | "manager",
  eventId?: Types.ObjectId,
  checkinStatus?: "waiting" | "checkedIn" | "checkedOut"
): Promise<UserDocument[]> => {
  await dbConnect();

  let users: UserDocument[] = [];

  const match: Partial<UserInputClient> = {};
  if (organizationId) match.organizationId = organizationId;
  if (role) match.role = role;
  users = await User.find(match);

  if (eventId) {
    const registrations = await Registration.find({ eventId });
    const userIds = new Set(
      registrations.map((registration) => registration.userId.toString())
    );
    users = users.filter((user) => userIds.has(user._id.toString()));
  }

  const checkedInAttendances = await Attendance.find({
    eventId,
    checkinTime: { $ne: null },
    checkoutTime: null,
  });
  const checkedOutAttendances = await Attendance.find({
    eventId,
    checkinTime: { $ne: null },
    checkoutTime: { $ne: null },
  });
  const checkedInUserIds = new Set(
    checkedInAttendances.map((attendance) => attendance.userId.toString())
  );
  const checkedOutUserIds = new Set(
    checkedOutAttendances.map((attendance) => attendance.userId.toString())
  );

  switch (checkinStatus) {
    case "waiting":
      users = users.filter(
        (user) =>
          !checkedInUserIds.has(user._id.toString()) &&
          !checkedOutUserIds.has(user._id.toString())
      );
      break;
    case "checkedIn":
      users = users.filter((user) => checkedInUserIds.has(user._id.toString()));
      break;
    case "checkedOut":
      users = users.filter((user) =>
        checkedOutUserIds.has(user._id.toString())
      );
      break;
  }

  return users;
};

export const createUserFromCredentials = async (
  userData: Partial<UserInputClient> &
    Required<Pick<UserInputClient, "email">> & { password: string } & {
      orgCode: string;
    }
): Promise<{
  user?: UserDocument | undefined;
  message?: string;
  status: number;
}> => {
  await dbConnect();

  if (await User.exists({ email: userData.email })) {
    return {
      status: 400,
      message: "Email address already exists, please login",
    };
  }

  const organization = await Organization.findOne({ slug: userData.orgCode });
  if (!organization) {
    return {
      status: 400,
      message:
        "The entered organization code does not exist. Please contact your administrator for assistance.",
    };
  }

  if (!organization.active) {
    return {
      status: 400,
      message: "The entered company code is currently marked as inactive.",
    };
  }
  if (userData.email in organization.invitedAdmins) {
    userData.role = "admin";
  }

  userData.organizationId = organization._id;
  userData.passwordHash = await hash(
    `${userData.email}${userData.password}`,
    10
  );

  return {
    status: 200,
    // @ts-expect-error
    user: User.create(userData),
  };
};

export const verifyUserWithCredentials = async (
  email: string,
  password: string
): Promise<{
  user?: UserDocument;
  message?: string;
  status: number;
}> => {
  await dbConnect();

  const user = await User.findOne({ email });

  if (!user) {
    return {
      status: 404,
      message: "Email address not found, please create an account",
    };
  }

  if (!user.passwordHash) {
    return {
      status: 400,
      message: "Please sign in with Google",
    };
  }
  const match = await bcrypt.compare(email + password, user.passwordHash);

  if (match) {
    return {
      status: 200,
      // @ts-expect-error
      message: user,
    };
  } else
    return {
      status: 400,
      message: "Password is incorrect",
    };
};

export const updateUser = async (
  id: Types.ObjectId,
  userData: Partial<UserInputClient>
): Promise<Types.ObjectId | undefined> => {
  await dbConnect();

  const user = await User.findByIdAndUpdate(id, userData, { new: true });
  if (!user) return undefined;

  await createHistoryEventEditProfile(user);
  return user._id;
};

export const updateUserOrganizationId = async (
  id: string,
  orgCode: string
): Promise<{
  user?: UserDocument | undefined;
  message?: string;
  status: number;
}> => {
  await dbConnect();

  const user = await User.findById(id);
  if (!user) {
    return {
      status: 404,
      message: "User not found",
    };
  }

  const organization = await Organization.findOne({ slug: orgCode });
  if (!organization) {
    return {
      status: 400,
      message:
        "The entered organization code does not exist. Please try to enter a different org code",
    };
  }

  if (!organization.active) {
    return {
      status: 400,
      message:
        "The organization corresponding to the entered code is currently marked as inactive.",
    };
  }

  await user.updateOne({
    organizationId: organization._id,
  });

  return {
    status: 200,
    user,
  };
};
