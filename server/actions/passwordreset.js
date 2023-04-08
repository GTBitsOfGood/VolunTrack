import dbConnect from "../mongodb/index";
import resetCode from "../mongodb/models/resetCode";
import User from "../mongodb/models/user";

export async function getUserIdFromCode(code) {
  await dbConnect();

  console.log("GETUSERID SERVER ACTIONS");
  console.log(code);
  const userId = await resetCode.findOne({ code: code });
  console.log("USER ID 2:");
  console.log(userId);
  return userId;
}

export async function sendResetEmail(email) {
  await dbConnect();

  console.log("HERE IN SERVER ACTIONS");
  const existingUser = await User.findOne({ "bio.email": email });
  if (!existingUser) {
    return {
      status: 400,
      message: "User does not exist",
    };
  }

  const userId = existingUser._id;
  console.log("USER ID:");
  console.log(userId);

  const code = makeCode(6);

  await resetCode.create({
    userId: userId,
    email: email,
    code: code,
    createdAt: new Date(),
  });

  console.log("done");
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
