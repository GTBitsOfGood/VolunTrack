import { sendResetCodeEmail } from "../../src/utils/mailersend-email";
import dbConnect from "../mongodb/index";
import resetCode from "../mongodb/models/resetCode";
import User from "../mongodb/models/user";

export async function getUserIdFromCode(code) {
  await dbConnect();

  const userId = await resetCode.findOne({ code: code });

  return userId;
}

export async function getUserFromEmail(email) {
  await dbConnect();

  const existingUser = await User.findOne({ "bio.email": email });
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

  await resetCode.create({
    userId: userId,
    email: email,
    code: code,
    createdAt: new Date(),
  });

  return { status: 200 };
}

function makeCode(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}
