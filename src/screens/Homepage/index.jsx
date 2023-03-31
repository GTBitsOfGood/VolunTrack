import { useSession } from "next-auth/react";
import EventManager from "../Events/EventManager";

const EventManagerSelector = () => {
  const {
    data: { user },
  } = useSession();

  if (user.role !== "volunteer") {
    return <EventManager user={user} role={user.role} isHomePage={true} />;
  } else {
    return <EventManager user={user} role={user.role} isHomePage={true} />;
  }
};

export default EventManagerSelector;
