import bcrypt from "bcrypt";
import dbConnect from "../mongodb/index";
import ResetCode from "../mongodb/models/ResetCode";
import User from "../mongodb/models/User";

export async function getUserIdFromCode(code) {
  await dbConnect();

  const userId = await ResetCode.findOne({ code: code });

  return userId;
}

export async function getUserFromEmail(email) {
  await dbConnect();

  const existingUser = await User.findOne({ email: email });
  if (!existingUser) {
    return {
      status: 400,
      message: "User does not exist",
    };
  }

  return existingUser;
}

export async function uploadResetCode(existingUser, email, code) {
  await dbConnect();

  const userId = existingUser._id;

  await ResetCode.create({
    userId: userId,
    email: email,
    code: code,
    createdAt: new Date(),
  });

  return { status: 200 };
}

export async function deleteResetCode(userId, code) {
  await dbConnect();

  await ResetCode.deleteOne({
    userId: userId,
    code: code,
  });

  return { status: 200 };
}

// Sets a new password for the account a reset code belongs to, then retires
// every reset code for that account so a used link stops working. Walk-ins
// from QR check-in have no password yet; this is how they set their first one.
export async function setPasswordFromResetCode(resetCode, password) {
  await dbConnect();

  const user = await User.findById(resetCode.userId);
  if (!user) return false;

  const passwordHash = await bcrypt.hash(user.email + password, 10);
  await User.updateOne({ _id: user._id }, { passwordHash });
  await ResetCode.deleteMany({ userId: user._id });

  return true;
}
