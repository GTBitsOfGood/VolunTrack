import { useSession } from "next-auth/react";
import React from "react";
import AdminEventManager from "./Admin";
import UserEventManager from "./User";
import EventManager from "./EventManager";

const EventManagerSelector = () => {
  const {
    data: { user },
  } = useSession();

  // return user.role === "admin" ? (
  //   <AdminEventManager user={user} />
  // ) : (
  //   <UserEventManager user={user} />
  // );
  return <EventManager user={user} role={user.role} />
};

export default EventManagerSelector;
