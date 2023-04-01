import { compare, hash } from "bcrypt";
import { HydratedDocument, Types } from "mongoose";
import dbConnect from "../mongodb/";
import Attendance from "../mongodb/models/Attendance";
import Registration from "../mongodb/models/Registration";
import User, { UserData } from "../mongodb/models/User";
import { createHistoryEventEditProfile } from "./historyEvent";

export const getUsers = async (
  organizationId?: Types.ObjectId,
  role?: "admin" | "volunteer" | "manager",
  eventId?: Types.ObjectId,
  isCheckedIn?: boolean
): Promise<HydratedDocument<UserData>[]> => {
  await dbConnect();

  let users: HydratedDocument<UserData>[] = [];

  if (!organizationId && !role) {
    users = await User.find();
  } else if (!organizationId) {
    users = await User.find({ role });
  } else if (!role) {
    users = await User.find({ organization: organizationId });
  } else {
    users = await User.find({ role, organization: organizationId });
  }

  if (eventId) {
    const registrations = await Registration.find({ event: eventId });
    const userIds = new Set(
      registrations.map((registration) => registration.user)
    );
    users = users.filter((user) => userIds.has(user._id));
  }

  if (isCheckedIn !== undefined) {
    const attendances = await Attendance.find({
      event: eventId,
      checkinTime: { $ne: null },
      checkoutTime: null,
    });
    const checkedInUserIds = new Set(
      attendances.map((attendance) => attendance.user)
    );
    if (isCheckedIn) {
      users = users.filter((user) => checkedInUserIds.has(user._id));
    } else {
      users = users.filter((user) => !checkedInUserIds.has(user._id));
    }
  }

  return users;
};

export const createUserFromCredentials = async (
  userData: Partial<UserData> & Required<Pick<UserData, "password" | "email">>
): Promise<HydratedDocument<UserData> | undefined> => {
  await dbConnect();

  if (await User.exists({ email: userData.email })) return undefined;

  hash(
    `${userData.email} ${userData.password}`,
    10,
    async function (err, hash) {
      userData.passwordHash = hash;
      return await User.create(userData);
    }
  );
};

export const verifyUserWithCredentials = async (
  email: string,
  password: string
): Promise<{ user?: HydratedDocument<UserData>; message?: string }> => {
  await dbConnect();

  const user = await User.findOne({ email });

  if (!user)
    return { message: "Email address not found, please create an account" };

  if (!user.passwordHash) return { message: "Please sign in with Google" };

  const match = await compare(email + password, user.passwordHash);

  if (match) return { user };
  else return { message: "Password is incorrect" };
};

export const updateUser = async (
  id: Types.ObjectId,
  userData: Partial<UserData>
): Promise<Types.ObjectId | undefined> => {
  await dbConnect();

  const user = await User.findByIdAndUpdate(id, userData, { new: true });
  if (!user) return undefined;

  createHistoryEventEditProfile(id);
  return user._id;
};
