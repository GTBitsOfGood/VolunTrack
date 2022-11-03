import { string, object } from "yup";

export const capitalizeFirstLetter = (s) => {
  if (s === "") return s;
  return `${s[0].toUpperCase()}${s.slice(1)}`;
};

export const profileValidator = object().shape({
  first_name: string().trim().required(" First name is required"),
  last_name: string().trim().required(" Last name is required"),
  email: string().trim().email('Invalid email'),
  phone_number: string().trim(),
  date_of_birth: string().trim(),
  zip_code: string().trim().matches(/^\d+$/, " ZIP should have digits only"),
  address: string().trim(),
  city: string().trim(),
  state: string().trim(),
});

/*

  title: string().trim().required(" Event title is required"),
  date: date().min(yesterday, " Date cannot be in the past").required(" Date is required"),
  startTime: string().required(" Start time is required"),
  endTime: string().required(" End time is required"),
  address: string().trim().required(" Address is required"),
  city: string().trim().required(" City is required"),
  state: string().trim().required(" State is required"),
  zip: string().trim().matches(/^\d+$/, " ZIP should have digits only").required(" ZIP is required")
,
  
  max_volunteers: number().moreThan(-1, " Max volunteers must be 0 or more").required(" Max volunteers is required"),
  description: string().trim(),

  eventContactPhone: string().trim().required(" Phone number is required"),
  eventContactEmail: string().trim().email('Invalid email').required(" Email is required"),
  isPrivate: string().trim().required(),

*/
