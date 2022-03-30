import initMiddleware from "../../../../lib/init-middleware";
import validateMiddleware from "../../../../lib/validate-middleware";

const { USER_DATA_VALIDATOR } = require("../../../../server/validators");
const { validationResult, matchedData } = require("express-validator");

const { createUser, getUsers } = require("../../../../server/actions/users");

const validateBody = initMiddleware(
  validateMiddleware(USER_DATA_VALIDATOR, validationResult)
);

export default async function handler(req, res, next) {
  if (req.method === "POST") {
    await validateBody(req, res);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.mapped() });
    }
    const newUserData = matchedData(req);
    let result = await createUser(newUserData, req.user);
    res.status(result.status).json(result.message);
  } else if (req.method === "GET") {
    let result = await getUsers(
      req.query.type,
      req.query.status,
      req.query.role,
      req.query.date,
      req.query.availability,
      req.query.email,
      req.query.lastPaginationId,
      req.query.pageSize,
      next
    );

    res.status(result.status).json(result.message);
  }
}
