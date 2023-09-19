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
