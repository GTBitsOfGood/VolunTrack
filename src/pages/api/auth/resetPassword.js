import { sendResetEmail } from "../../../../server/actions/passwordreset";
import { sendEventEditedEmail } from "../../../utils/mailersend-email";
import { getUserIdFromCode } from "../../../../server/actions/passwordreset";

export default async function handler(req, res, next) {
  if (req.method === "POST") {
    const email = req.query.email;

    await sendResetEmail(email);

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
}
