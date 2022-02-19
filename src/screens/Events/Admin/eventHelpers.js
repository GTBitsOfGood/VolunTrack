import { string, object, number, date, array } from "yup";

export const eventValidator = object().shape({
  title: string().trim().required(),
  date: date().required(),
  description: string().trim().required(),
});
