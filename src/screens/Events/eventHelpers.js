import axios from "axios";

export const registerForEvent = async (data) =>
  (await axios.post(`/api/events/${data.event._id}/register`, data)).data;

export const updateEvent = async (event) =>
  (await axios.put(`/api/events/${event._id}`, event)).data;
