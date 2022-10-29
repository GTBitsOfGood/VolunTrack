import { string, object, number, date, array } from "yup";

const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);

export const standardEventValidator = object().shape({
  title: string().trim().required(),
  date: date().min(yesterday, "Date cannot be in the past").required(),
  startTime: string().required(),
  endTime: string().required(),
  address: string().trim().required(),
  city: string().trim().required(),
  zip: string().trim().matches(/^\d+$/, 'ZIP should have digits only').required("ZIP is required")
,
  
  max_volunteers: number().moreThan(-1, "Cannot be a negative number").required(),
  description: string().trim(),

  eventContactPhone: string().trim().required(),
  eventContactEmail: string().trim().required(),
  isPrivate: string().trim().required(),
});

export const groupEventValidator = object().shape({
  title: string().trim().required(),
  date: date().required(),
  startTime: string().required(),
  endTime: string().required(),
  address: string().trim().required(),
  city: string().trim().required(),
  zip: string().trim().required(),
  max_volunteers: string().trim().required(),
  description: string().trim(),

  eventContactPhone: string().trim().required(),
  eventContactEmail: string().trim().required(),

  pocName: string().trim().required(),
  pocEmail: string().trim().required(),
  pocPhone: string().trim().required(),

  orgName: string().trim().required(),
  orgAddress: string().trim().required(),
  orgCity: string().trim().required(),
  orgState: string().trim().required(),
  orgZip: string().trim().required(),
  isPrivate: string().trim().required(),
});
