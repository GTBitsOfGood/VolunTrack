import {
  getUserFromEmail,
  uploadResetCode,
  getUserIdFromCode,
  deleteResetCode,
} from "../../../../server/actions/passwordreset";
import { sendResetCodeEmail } from "../../../utils/mailersend-email";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const email = req.query.email;
    const isCheckedIn = req.body.isCheckedIn;

    const existingUser = await getUserFromEmail(email);

    if (existingUser?.status === 400)
      return res.status(400).json({ message: "User Does not Exist" });

    const code = makeCode(6);
    await uploadResetCode(existingUser, email, code);

    // we should probably send a different template for the day of check in users
    // they could sign in with Google for instance and don't necessarily need to create a password
    await sendResetCodeEmail(existingUser, email, code, isCheckedIn);

    res.status(200).json({ message: "Email Sent" });
  } else if (req.method === "GET") {
    const code = req.query.code;

    const userId = await getUserIdFromCode(code);

    return res.status(200).json({
      userId,
    });
  } else if (req.method === "DELETE") {
    const code = req.query.code;
    const userId = req.query.userId;

    await deleteResetCode(userId, code);

    return res.status(204).end();
  } else {
    res.status(404).json({ message: "Invalid Request Method" });
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
}
