import axios from "axios";
import { string, object } from "yup";

export const registerForEvent = async (data) =>
  (await axios.post(`/api/events/${data.event._id}/register`, data)).data;

export const updateEvent = async (event) =>
  (await axios.put(`/api/events/${event._id}`, event)).data;

export const minorNameValidator = object().shape({
  firstName: string().trim().required("First name is required"),
  lastName: string().trim().required("Last name is required"),
});
