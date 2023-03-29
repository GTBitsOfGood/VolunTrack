import { hash } from "bcrypt";
import { HydratedDocument, Types } from "mongoose";
import User, { UserData } from "../mongodb/models/User";
import { createHistoryEventEditProfile } from "./historyEvent";

export const getUser = async (
  id: Types.ObjectId
): Promise<HydratedDocument<UserData> | undefined> => {
  const user = await User.findById(id);
  if (!user) return undefined;
  return user;
};

export const getUsers = async (
  organizationId?: Types.ObjectId,
  role?: "admin" | "volunteer" | "manager"
): Promise<HydratedDocument<UserData>[]> => {
  if (!organizationId && !role) {
    return User.find();
  } else if (!organizationId) {
    return User.find({ role });
  } else if (!role) {
    return User.find({ organization: organizationId });
  } else {
    return User.find({ role, organization: organizationId });
  }
};

export const createUserFromCredentials = async (
  userData: UserData & { password: string }
): Promise<Types.ObjectId | undefined> => {
  if (await User.exists({ email: userData.email })) return undefined;

  hash(userData.email + userData.password, 10, async function (err, hash) {
    userData.passwordHash = hash;
    return (await User.create(userData))._id;
  });
};

export const updateUser = async (
  id: Types.ObjectId,
  userData: Partial<UserData>
): Promise<Types.ObjectId | undefined> => {
  const user = await User.findByIdAndUpdate(id, userData, { new: true });
  if (!user) return undefined;

  createHistoryEventEditProfile(id);
  return user._id;
};
