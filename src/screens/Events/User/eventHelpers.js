import axios from "axios";
import { date, object, string } from "yup";

export const eventValidator = object().shape({
  title: string().trim().required(),
  date: date().required(),
  startTime: string().required(),
  endTime: string().required(),
  address: string().trim().required(),
  city: string().trim().required(),
  zip: string().trim().required(),
  volunteers: string().trim().required(),
  description: string().trim().required(),
});

export const registerForEvent = async (data) =>
  (await axios.post(`/api/events/${data.event._id}/register`, data)).data;

export const updateEvent = async (event) =>
  (await axios.put(`/api/events/${event._id}`, event)).data;

export const getEventVolunteersList = async (event) => 
  await axios.get(`/api/events/${event._id}/volunteers`);