import { useSession } from "next-auth/react";
import React from "react";
import UserEventManager from "./User";

const EventManagerSelector = () => {
  const {
    data: { user },
  } = useSession();

  return user.role === "admin" ? (
    <AdminEventManager user={user} />
  ) : (
    <UserEventManager user={user} />
  );
};

export default EventManagerSelector;
