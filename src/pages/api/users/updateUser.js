const { updateUser } = require("../../../../server/actions/users");

export default async function handler(req, res, next) {
    if (req.method === "POST") {
        let result = await updateUser(req.query.email, req.query.phone_number, req.query.first_name, req.query.last_name);
        
        if (result.status === 200) {
            res.sendStatus(200);
        } else {
            res.status(result.status).json(result.message);
        }
    }
}