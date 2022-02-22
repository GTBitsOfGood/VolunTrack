const { deleteEventID, updateEventID } = require("../../../../server/actions/events");
const {isValidObjectID} = require("../../../../server/validators");

export default async function handler(req, res, next) {
    if (req.method === "DELETE") {
        //const id = req.params.id;
        // for some reason after migration, the id ends up in req.query???
        // i have no idea why
        const id = req.query.id;
        if (!isValidObjectID(id)) {
            res.status(400).json({ error: "Object ID not valid" });
        }

        await deleteEventID(id, next);
        
        res.json({
            message: "Event successfully deleted!",
        });

    } else if (req.method === "PUT") {
        const eventID = req.query.id;
        const event = req.body;

        await updateEventID(eventID, event);
        
        res.json({
            message: "Event successfully updated!",
        });
    }
}