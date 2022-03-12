const { check, oneOf, validationResult } = require("express-validator");
const {
  getUserFromId,
  updateUser,
  deleteUserId,
} = require("../../../../server/actions/users");
const { USER_DATA_VALIDATOR } = require("../../../../server/validators");

import initMiddleware from "../../../../lib/init-middleware";
import validateMiddleware from "../../../../lib/validate-middleware";

const validateBody = initMiddleware(
  validateMiddleware(USER_DATA_VALIDATOR, validationResult)
);

export default async function handler(req, res, next) {
  if (req.method === "GET") {
    // Not 100% sure this works
    check("id").isMongoId();

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.mapped() });
    }

    let result = getUserFromId(req.params.id, next);
    res.status(result.status).json(result.message);
  } else if (req.method === "PUT") {
    check("id").isMongoId();
    oneOf(USER_DATA_VALIDATOR);
    validateBody(req, res);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.mapped() });
    }

    const userDataReq = req.body.bio;
    let result = await updateUser(
      userDataReq.email,
      userDataReq.phone_number,
      userDataReq.first_name,
      userDataReq.last_name,
      userDataReq.date_of_birth,
      userDataReq.zip_code,
      userDataReq.total_hours,
      userDataReq.address,
      userDataReq.city,
      userDataReq.state
    );
    res.status(result.status).json(result.message);
  } else if (req.method === "DELETE") {
    check("id").isMongoId();

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.mapped() });
    }

    let result = await deleteUserId(req.user, req.params.id, next);
    res.status(result.status).json(result.message);
  }
}
