import { string, object, number, date, array } from "yup";

export const eventValidator = object().shape({
  title: string().trim().required(),
  date: date().required(),
  startTime: string().required(),
  endTime: string().required(),
  address: string().trim().required(),
  city: string().trim().required(),
  zip: string().trim().required(),
  max_volunteers: string().trim().required(),
  description: string().trim(),
  pocName: string().trim().required(),
  pocEmail: string().trim().required(),
  pocPhone: string().trim().required(),
  addressLineOne: string().trim().required(),
  addressLineTwo: string().trim(),
  orgCity: string().trim().required(),
  orgState: string().trim().required(),
  orgZip: string().trim().required(),
});
