import { string, object, number, date } from 'yup';

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
