import { useSession } from "next-auth/react";
import React from "react";
import UserEventManager from "./User";
import EventManager from "../Events";

const EventManagerSelector = () => {
  const {
    data: { user },
  } = useSession();

  if (user.role !== "volunteer") {
    return <EventManager user={user} role={user.role} />;
  } else {
    return <UserEventManager user={user} />;
  }
};

export default EventManagerSelector;
