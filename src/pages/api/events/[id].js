const { deleteEventID, updateEventID } = require("../../../../server/actions/events");
const {isValidObjectID} = require("../../../../server/validators");

export default function handler(req, res, next) {
    if (req.method === "DELETE") {
        const id = req.params.id;
        if (!isValidObjectID(id)) {
            res.status(400).json({ error: "Object ID not valid" });
        }

        await deleteEventID(id, next);
        
        res.json({
            message: "Event successfully deleted!",
        });

    } else if (req.method === "PUT") {
        const eventID = req.params.id;
        const event = req.body;

        await updateEventID(eventID, event);

        res.json(updatedEvent.toJSON());
    }
}