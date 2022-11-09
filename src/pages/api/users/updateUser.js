const { updateUser } = require("../../../../server/actions/users");

export default async function handler(req, res) {
  if (req.method === "POST") {
    console.log("Update user POST")

    let result = await updateUser(
      req.query.email,
      req.query.phone_number,
      req.query.first_name,
      req.query.last_name,
      req.query.date_of_birth,
      req.query.zip_code,
      req.query.address,
      req.query.city,
      req.query.state,
      req.query.notes
    );

    if (result.status === 200) {
      res.status(200).send();
    } else {
      res.status(result.status).json(result.message);
    }
  }
}
