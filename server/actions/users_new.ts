import bcrypt, {compare, hash} from "bcrypt";
import {HydratedDocument, Types} from "mongoose";
import dbConnect from "../mongodb/";
import Attendance from "../mongodb/models/Attendance";
import Registration from "../mongodb/models/Registration";
import User, {UserData} from "../mongodb/models/User";
import {createHistoryEventEditProfile} from "./historyEvent";
import {ObjectId} from "mongodb";
import Organization from "../mongodb/models/Organization";

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
    users = await User.find({ organizationId });
  } else {
    users = await User.find({ role, organizationId });
  }

  if (eventId) {
    const registrations = await Registration.find({ eventId });
    const userIds = new Set(
      registrations.map((registration) => registration.userId)
    );
    users = users.filter((user) => userIds.has(user._id));
  }

  if (isCheckedIn !== undefined) {
    const attendances = await Attendance.find({
      eventId,
      checkinTime: { $ne: null },
      checkoutTime: null,
    });
    const checkedInUserIds = new Set(
      attendances.map((attendance) => attendance.userId)
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
  userData: Partial<UserData> &
    Required<Pick<UserData, "email">> & { password: string } & { orgCode: string }
): Promise<{user?: HydratedDocument<UserData> | undefined, message?: string, status: number}> => {
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

  if (organization.active === false) {
    return {
      status: 400,
      message: "The entered company code is currently marked as inactive.",
    };
  }
  if (userData.email in organization.invitedAdmins) {
    userData.role = "admin";
  }

  userData.organizationId = organization._id
  userData.passwordHash = await hash(`${userData.email}${userData.password}`, 10);


  return {
    status: 200,
    // @ts-ignore
    user: User.create(userData),
  };
};

export const verifyUserWithCredentials = async (
  email: string,
  password: string
): Promise<{ user?: HydratedDocument<UserData>; message?: string , status: number}> => {
  await dbConnect();

  const user  = await User.findOne({ email });

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

  if (match)
    {
      return {
            status: 200,
            // @ts-ignore
            message: user,
          };
    }
  else
    return {
      status: 400,
      message: "Password is incorrect",
    };
};

export const updateUser = async (
  id: Types.ObjectId,
  userData: Partial<UserData>
): Promise<Types.ObjectId | undefined> => {
  await dbConnect();

  const user = await User.findByIdAndUpdate(id, userData, { new: true });
  if (!user) return undefined;

  await createHistoryEventEditProfile(user);
  return user._id;
};
