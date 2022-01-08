const { check, oneOf, validationResult, matchedData } = require("express-validator");
const { getUserFromId, updateUserId, deleteUserId } = require("../../../../server/actions/users");
const { USER_DATA_VALIDATOR } = require("../../../../server/validators");
const { SendEmailError } = require("../../../../server/errors");

import initMiddleware from "../../../../lib/init-middleware";
import validateMiddleware from "../../../../lib/validate-middleware";

const validateBody = initMiddleware(
    validateMiddleware(USER_DATA_VALIDATOR, validationResult)
)

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

        const userDataReq = matchedData(req);
        const events = req.body.events;

        let result = updateUserId(userDataReq, events, req.params.id, req.query.action)
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