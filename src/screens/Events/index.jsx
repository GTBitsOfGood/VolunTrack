import { useSession } from "next-auth/react";
import EventManager from "./EventManager";

const EventManagerSelector = () => {
  const {
    data: { user },
  } = useSession();
  return <EventManager user={user} role={user.role} isHomePage={false} />;
};

export default EventManagerSelector;
