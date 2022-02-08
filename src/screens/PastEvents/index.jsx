import React from "react";
import AdminEventManager from "./Admin";
import UserEventManager from "./User";

// todo: delete once authorization has been added
const IS_ADMIN = true;

const EventManagerSelector = (props) =>
  <UserEventManager />;

export default EventManagerSelector;
