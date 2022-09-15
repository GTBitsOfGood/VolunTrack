import { string, object, number, date, array } from "yup";
import axios from "axios";

export const eventValidator = object().shape({
  name: string().trim().required(),
  date: date().required(),
  location: string().trim().required(),
  description: string().trim().required(),
  contact_phone: string().trim(),
  contact_email: string().email().trim(),
  shifts: array()
    .of(
      object().shape({
        start_time: string().required(),
        end_time: string().required(),
        max_volunteers: number().required(),
      })
    )
    .required(),
});

export const updateEvent = async (event) =>
  (await axios.put(`/api/events/${event._id}`, event)).data;
