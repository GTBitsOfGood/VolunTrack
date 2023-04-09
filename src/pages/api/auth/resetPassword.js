import {
  getUserFromEmail,
  uploadResetCode,
} from "../../../../server/actions/passwordreset";
import { sendResetCodeEmail } from "../../../utils/mailersend-email";
import { getUserIdFromCode } from "../../../../server/actions/passwordreset";

export default async function handler(req, res, next) {
  if (req.method === "POST") {
    const email = req.query.email;

    const existingUser = await getUserFromEmail(email);

    const code = makeCode(6);
    await uploadResetCode(existingUser, email, code);
    sendResetCodeEmail(existingUser, email, code);

    res.status(200).json({ message: "Email Sent" });
  } else if (req.method === "GET") {
    const code = req.query.code;

    const userId = await getUserIdFromCode(code);

    return res.status(200).json({
      userId,
    });
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
