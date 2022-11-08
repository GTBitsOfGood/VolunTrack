import { string, object } from "yup";

export const capitalizeFirstLetter = (s) => {
  if (s === "") return s;
  return `${s[0].toUpperCase()}${s.slice(1)}`;
};

export const profileValidator = object().shape({
  first_name: string().trim().required(" First name is required"),
  last_name: string().trim().required(" Last name is required"),
  email: string().trim().email("Invalid email"),
  phone_number: string().trim().required("Phone number is required"),
  date_of_birth: string().trim().required(" Date of birth is required"),
  zip_code: string()
    .trim()
    .matches(/^\d+$/, " ZIP should have digits only")
    .required("Zip Code is required"),
  address: string().trim().required(" Address is required"),
  city: string().trim().required(" City is required"),
  state: string().trim().required(" State is required"),
});

