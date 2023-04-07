import { date, number, object, string } from "yup";

const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);

export const standardEventValidator = object().shape({
  title: string().trim().required(" Event title is required"),
  date: date()
    .min(yesterday, " Date cannot be in the past")
    .required(" Date is required"),
  startTime: string().required(" Start time is required"),
  endTime: string().required(" End time is required"),
  address: string().trim().required(" Address is required"),
  city: string().trim().required(" City is required"),
  state: string().trim().required(" State is required"),
  zip: string()
    .trim()
    .matches(/^\d+$/, " ZIP should have digits only")
    .required(" ZIP is required"),
  maxVolunteers: number()
    .moreThan(-1, " Max volunteers must be 0 or more")
    .required(" Max volunteers is required"),
  localTime: string().required(),
  description: string().trim(),

  eventContactPhone: string().trim().required(" Phone number is required"),
  eventContactEmail: string()
    .trim()
    .email("Invalid email")
    .required(" Email is required"),
  // isPrivate: boolean().optional(),
});

export const groupEventValidator = object().shape({
  title: string().trim().required(" Event title is required"),
  date: date()
    .min(yesterday, " Date cannot be in the past")
    .required(" Date is required"),
  startTime: string().required(" Start time is required"),
  endTime: string().required(" End time is required"),
  address: string().trim().required(" Address is required"),
  city: string().trim().required(" City is required"),
  state: string().trim().required(" State is required"),
  zip: string()
    .trim()
    .matches(/^\d+$/, " ZIP should have digits only")
    .required(" ZIP is required"),
  max_volunteers: number()
    .moreThan(-1, " Max volunteers must be 0 or more")
    .required(" Max volunteers is required"),

  localTime: string().required(),
  description: string().trim(),

  eventContactPhone: string().trim().required(" Phone number is required"),
  eventContactEmail: string()
    .trim()
    .email("Invalid email")
    .required(" Email is required"),

  pocName: string().trim().required(" POC name is requred"),
  pocEmail: string()
    .trim()
    .email("Invalid email")
    .required(" POC email is required"),
  pocPhone: string().trim().required(" POC phone is required"),

  orgName: string().trim().required(" Org name is required"),
  orgAddress: string().trim().required(" Org address is required"),
  orgCity: string().trim().required(" Org city is required"),
  orgState: string().trim().required(" Org state is required"),
  orgZip: string()
    .trim()
    .matches(/^\d+$/, " ZIP should have digits only")
    .required(" Org ZIP is required"),
  // isPrivate: boolean().optional(),
});

export const timeValidator = object().shape({
  checkin: string().test(
    "checkin-time-before-checkout",
    "checkin time needs to be before checkout time",
    (value, context) => value < context.parent.checkout
  ),
});
