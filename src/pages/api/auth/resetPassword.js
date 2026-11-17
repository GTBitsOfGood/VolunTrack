import {
  getUserFromEmail,
  uploadResetCode,
  getUserIdFromCode,
  deleteResetCode,
  setPasswordFromResetCode,
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
  } else if (req.method === "PUT") {
    // A person resetting a password isn't signed in, so the reset code is what
    // proves which account this is. Same rules as the reset form.
    const { code, password } = req.body ?? {};
    if (
      typeof code !== "string" ||
      typeof password !== "string" ||
      password.length < 10 ||
      !/[a-zA-Z]/.test(password)
    ) {
      return res.status(400).json({
        error:
          "Enter a password of at least 10 characters with at least 1 letter.",
      });
    }

    const resetCode = await getUserIdFromCode(code);
    if (!resetCode || !(await setPasswordFromResetCode(resetCode, password))) {
      return res.status(400).json({
        error: "This reset link is not valid. Please request a new one.",
      });
    }

    return res.status(200).json({ message: "Password updated" });
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
