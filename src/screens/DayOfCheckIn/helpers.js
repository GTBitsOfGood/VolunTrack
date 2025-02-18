import { string, object } from "yup";

export const checkInValidator = object().shape({
  firstName: string().trim().required("First name is required"),
  lastName: string().trim().required("Last name is required"),
  volunteerEmail: string()
    .trim()
    .required("Email is required")
    .email("Invalid email"),
});
