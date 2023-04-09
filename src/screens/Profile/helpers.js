import { string, object } from "yup";

export const capitalizeFirstLetter = (s) => {
  if (s === "") return s;
  return `${s[0].toUpperCase()}${s.slice(1)}`;
};

export const profileValidator = object().shape({
  firstName: string().trim().required(" First name is required"),
  lastName: string().trim().required(" Last name is required"),
  email: string().trim().email("Invalid email"),
  phone: string().trim().required("Phone number is required"),
  dob: string().trim().required(" Date of birth is required"),
  zip: string()
    .trim()
    .matches(/^\d+$/, " ZIP should have digits only")
    .required("Zip Code is required"),
  address: string().trim().required(" Address is required"),
  city: string().trim().required(" City is required"),
  state: string().trim().required(" State is required"),
});
