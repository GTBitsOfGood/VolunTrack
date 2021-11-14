import { string, object, number, date } from 'yup';
import axios from 'axios';

export const eventValidator = object().shape({
  name: string()
    .trim()
    .required(),
  date: date().required(),
  location: string()
    .trim()
    .required(),
  description: string()
    .trim()
    .required(),
  contact_phone: string().trim(),
  contact_email: string()
    .email()
    .trim(),
  external_links: string()
    .url()
    .trim(),
  max_volunteers: number()
    .positive()
    .required()
});

export const updateEvent = async event => (await axios.put(`/api/events/${event._id}`, event)).data;
