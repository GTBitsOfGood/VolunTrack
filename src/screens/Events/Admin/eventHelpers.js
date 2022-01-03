import { string, object, number, date, array } from "yup";

export const eventValidator = object().shape({
  name: string().trim().required(),
  date: date().required(),
  location: string().trim().required(),
  description: string().trim().required(),
  contact_phone: string().trim(),
  contact_email: string().email().trim(),
  external_links: string().url().trim(),
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
