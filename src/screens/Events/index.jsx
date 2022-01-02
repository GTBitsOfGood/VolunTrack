import AdminEventManager from "./Admin";
import UserEventManager from "./User";

// todo: delete once authorization has been added 
const IS_ADMIN = true

const EventManagerSelector = (isAdmin) => isAdmin || IS_ADMIN ? AdminEventManager : UserEventManager

export default EventManagerSelector