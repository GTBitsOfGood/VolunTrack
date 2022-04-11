import { useSession } from "next-auth/react";
import React from "react";
import UserEventManager from "./User";
import EventManager from "../Events/Admin";

const EventManagerSelector = () => {
  const {
    data: { user },
  } = useSession();

  if (user.role !== "volunteer") {
      return <EventManager user={user} />
    } else {
      return <UserEventManager user={user} />
    }
};

export default EventManagerSelector;
