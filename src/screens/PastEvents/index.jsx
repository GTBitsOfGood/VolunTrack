import React from "react";
import AdminEventManager from "./Admin";
import UserEventManager from "./User";

const EventManagerSelector = (props) =>
  props.isAdmin || IS_ADMIN ? <AdminEventManager /> : <UserEventManager />;

export default EventManagerSelector;
